const db = require('../../models');
const { Op } = require('sequelize');

// Get all payrolls with pagination (Admin view)
const getNominas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        // Filter by employee ID if provided
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

// Get payroll by ID
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

// Get payrolls for specific employee
const getNominasByEmpleado = async (req, res) => {
    try {
        const id_empleado = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        // Validate employee exists
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

// Helper function to calculate overtime from attendance
const calculateOvertimeHours = async (id_empleado, periodo) => {
    try {
        // Extract year and month from periodo (format: YYYY-MM)
        const [year, month] = periodo.split('-');
        
        // Get all attendance records for the employee in the specified month
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
        
        // Calculate hours worked each day
        let totalHours = 0;
        let overtimeHours = 0;
        
        attendance.forEach(record => {
            const entryTime = new Date(`${record.fecha}T${record.hora_entrada}`);
            const exitTime = new Date(`${record.fecha}T${record.hora_salida}`);
            
            // Calculate hours worked in milliseconds, then convert to hours
            const hoursWorked = (exitTime - entryTime) / (1000 * 60 * 60);
            
            totalHours += hoursWorked;
            
            // Add overtime if worked more than 8 hours in a day
            if (hoursWorked > 8) {
                overtimeHours += (hoursWorked - 8);
            }
        });
        
        // Check if total hours exceed 40 hours per week
        const weeksInMonth = 4; // Approximate
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

// Create a new payroll
const createNomina = async (req, res) => {
    try {
        const { id_empleado, periodo, bonificaciones = 0 } = req.body;
        
        // Validate required fields
        if (!id_empleado || !periodo) {
            return res.status(400).json({ 
                error: 'Se requieren los campos id_empleado y periodo' 
            });
        }
        
        // Check if employee exists
        const empleado = await db.empleados.findByPk(id_empleado);
        if (!empleado) {
            return res.status(404).json({ error: 'El empleado no existe' });
        }
        
        // Check if a payroll already exists for this employee/period
        const existingPayroll = await db.nominas.findOne({
            where: { id_empleado, periodo }
        });
        
        if (existingPayroll) {
            return res.status(400).json({ 
                error: 'Ya existe una nómina para este empleado en este período' 
            });
        }
        
        // Calculate overtime hours
        const horasExtra = await calculateOvertimeHours(id_empleado, periodo);
        
        // Get employee's base salary
        const salarioBase = empleado.salario;
        
        // Calculate gross salary
        const salarioBruto = salarioBase + parseFloat(bonificaciones) + horasExtra;
        
        // Calculate deductions
        const deduccionRap = salarioBruto * 0.04; // 4% para RAP
        const deduccionIhss = salarioBruto * 0.025; // 2.5% para IHSS
        
        // Calculate net salary
        const salarioNeto = salarioBruto - deduccionRap - deduccionIhss;
        
        // Create payroll record
        const nuevaNomina = await db.nominas.create({
            id_empleado,
            periodo,
            bonificaciones,
            horas_extra: horasExtra,
            salario_bruto: salarioBruto,
            salario_neto: salarioNeto,
            deduccion_rap: deduccionRap,
            deduccion_ihss: deduccionIhss,
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

module.exports = {
    getNominas,
    getNominaById,
    getNominasByEmpleado,
    createNomina
};