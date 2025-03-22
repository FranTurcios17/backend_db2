const db = require('../../models');
const { Op } = require('sequelize');

const getNominas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const where = {};
        if (req.query.id_empleado) {
            where.id_empleado = req.query.id_empleado;
        }
        
        const nominas = await db.nominas.findAndCountAll({
            where,
            limit,
            offset,
            order: [['fecha_generacion', 'DESC']],
            include: { model: db.empleados, as: "empleado" }
        });
        
        res.status(200).json({
            total: nominas.count,
            totalPages: Math.ceil(nominas.count / limit),
            currentPage: page,
            nominas: nominas.rows
        });
    } catch (error) {
        console.log("Error al obtener las nóminas:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getNominaById = async (req, res) => {
    try {
        const id = req.params.id;
        const nomina = await db.nominas.findByPk(id, {
            include: { model: db.empleados, as: "empleado" }
        });

        if (!nomina) {
            return res.status(404).json({ error: 'La nómina no existe' });
        }

        res.status(200).json(nomina);
    } catch (error) {
        console.log("Error al obtener la nómina:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getNominasByEmpleado = async (req, res) => {
    try {
        const id_empleado = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }

        const nominas = await db.nominas.findAndCountAll({
            where: { id_empleado },
            limit,
            offset,
            order: [['fecha_generacion', 'DESC']]
        });

        res.status(200).json({
            total: nominas.count,
            totalPages: Math.ceil(nominas.count / limit),
            currentPage: page,
            nominas: nominas.rows
        });
    } catch (error) {
        console.log("Error al obtener las nóminas del empleado:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const calculateOvertimeHours = async (id_empleado, periodo) => {
    try {
        const [year, month] = periodo.split('-');
        
        const startDate = `${year}-${month}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month}-${lastDay}`;
        
        const attendance = await db.asistencia.findAll({
            where: {
                id_empleado,
                fecha: {
                    [Op.between]: [startDate, endDate]
                },
                hora_entrada: { [Op.not]: null },
                hora_salida: { [Op.not]: null }
            }
        });
        
        let totalHours = 0;
        let overtimeHours = 0;
        
        attendance.forEach(record => {
            const entryTime = new Date(`${record.fecha}T${record.hora_entrada}`);
            const exitTime = new Date(`${record.fecha}T${record.hora_salida}`);
            
            const hoursWorked = (exitTime - entryTime) / (1000 * 60 * 60);
            
            totalHours += hoursWorked;
            
            if (hoursWorked > 8) {
                overtimeHours += (hoursWorked - 8);
            }
        });
        
        const weeksInMonth = 4;
        const regularHoursLimit = 40 * weeksInMonth;
        
        if (totalHours > regularHoursLimit) {
            overtimeHours += (totalHours - regularHoursLimit);
        }
        
        return overtimeHours;
    } catch (error) {
        console.log("Error calculating overtime:", error);
        return 0;
    }
};

const createNomina = async (req, res) => {
    try {
        const { id_empleado, periodo, bonificaciones = 0 } = req.body;
        
        const empleado = await db.empleados.findByPk(id_empleado);
        
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        
        const horasExtra = 0; 
        const salarioBase = empleado.salario;
        
        const salarioBruto = salarioBase + parseFloat(bonificaciones || 0) + horasExtra;
        
        const empleadoDeducciones = await db.empleado_deducciones.findAll({
            where: { 
                id_empleado, 
                activo: true 
            },
            include: [{ 
                model: db.deducciones, 
                as: "deduccion" 
            }]
        });
        
        let totalDeducciones = 0;
        
        for (const empDeduccion of empleadoDeducciones) {
            const deduccion = empDeduccion.deduccion;
            
            if (deduccion.porcentaje) {
                const montoDeduccion = salarioBruto * (deduccion.porcentaje / 100);
                totalDeducciones += montoDeduccion;
            }
        }
        
        if (empleadoDeducciones.length === 0) {
            const deduccionRap = salarioBruto * 0.04; 
            const deduccionIhss = salarioBruto * 0.025;
            totalDeducciones = deduccionRap + deduccionIhss;
        }
        
        const salarioNeto = salarioBruto - totalDeducciones;
        
        const nuevaNomina = await db.nominas.create({
            id_empleado,
            periodo,
            bonificaciones,
            horas_extra: horasExtra,
            salario_bruto: salarioBruto,
            salario_neto: salarioNeto,
            deduccion_rap: 0, 
            deduccion_ihss: 0,
            fecha_generacion: new Date()
        });
        
        res.status(201).json({
            message: 'Nómina creada exitosamente',
            nomina: nuevaNomina
        });
    } catch (error) {
        console.log("Error al crear la nómina:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const createBatchNominas = async (req, res) => {
    try {
        // Get all active employees
        const activeEmployees = await db.empleados.findAll({
            where: { activo: true }
        });
        
        if (activeEmployees.length === 0) {
            return res.status(404).json({ error: 'No hay empleados activos' });
        }
        
        // Store created payrolls count
        let createdCount = 0;
        let errors = [];
        
        // Process each employee
        for (const empleado of activeEmployees) {
            try {
                // Get the employee's latest payroll to determine next period
                const latestPayroll = await db.nominas.findOne({
                    where: { id_empleado: empleado.id_empleado },
                    order: [['fecha_generacion', 'DESC']]
                });
                
                // Determine period (YYYY-MM)
                let periodo;
                if (latestPayroll) {
                    // Extract current period and calculate next
                    const currentPeriod = latestPayroll.periodo;
                    if (currentPeriod && currentPeriod.includes('-') && currentPeriod.length >= 7) {
                        try {
                            const [year, month] = currentPeriod.split('-').map(p => parseInt(p));
                            if (month === 12) {
                                periodo = `${year + 1}-01`;
                            } else {
                                const nextMonth = (month + 1).toString().padStart(2, '0');
                                periodo = `${year}-${nextMonth}`;
                            }
                        } catch (e) {
                            // If parsing fails, use current month
                            const now = new Date();
                            periodo = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
                        }
                    } else {
                        // Invalid format in DB, use current month
                        const now = new Date();
                        periodo = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
                    }
                } else {
                    // No previous payroll, use current month
                    const now = new Date();
                    periodo = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
                }
                
                // Calculate salary
                const salarioBase = empleado.salario;
                const salarioBruto = salarioBase; // No extras or bonuses in batch mode
                
                // Calculate deductions
                const deduccionRap = salarioBruto * 0.04; // 4% para RAP
                const deduccionIhss = salarioBruto * 0.025; // 2.5% para IHSS
                const totalDeducciones = deduccionRap + deduccionIhss;
                
                // Calculate net salary
                const salarioNeto = salarioBruto - totalDeducciones;
                
                // Create payroll
                await db.nominas.create({
                    id_empleado: empleado.id_empleado,
                    periodo,
                    bonificaciones: 0, // Default no bonuses in batch mode
                    horas_extra: 0, // Default no overtime in batch mode
                    salario_bruto: salarioBruto,
                    salario_neto: salarioNeto,
                    deduccion_rap: deduccionRap,
                    deduccion_ihss: deduccionIhss,
                    fecha_generacion: new Date()
                });
                
                createdCount++;
            } catch (employeeError) {
                // Log error and continue with next employee
                console.error(`Error creating payroll for employee ${empleado.id_empleado}:`, employeeError);
                errors.push({
                    id_empleado: empleado.id_empleado,
                    error: employeeError.message
                });
            }
        }
        
        // Return success with count
        res.status(200).json({
            message: `Se generaron ${createdCount} nóminas correctamente`,
            generated: createdCount,
            total: activeEmployees.length,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error("Error en la generación masiva de nóminas:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    getNominas,
    getNominaById,
    getNominasByEmpleado,
    createNomina,
    createBatchNominas
};