const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    try {
        const students = await getAllStudents(req.query);
        res.status(200).json({
            success: true,
            students
        });
    } catch (error) {
        res.status(error.statusCode || 500);
        throw new Error(error.message || 'Unable to fetch students');
    }
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const studentData = req.body;

    if (!studentData.name || !studentData.email) {
        res.status(400);
        throw new Error('Name and email are required fields');
    }

    try {
        const newStudent = await addNewStudent(studentData);
        res.status(201).json({
            success: true,
            data: newStudent
        });
    } catch (error) {
        res.status(error.statusCode || 500);
        throw new Error(error.message || 'Unable to add student');
    }
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
        res.status(400);
        throw new Error('Student ID is required');
    }

    const updatedStudent = await updateStudent(id, updateData);

    if (!updatedStudent) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.status(200).json({
        success: true,
        data: updatedStudent
    });
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400);
        throw new Error('Student ID is required');
    }

    const student = await getStudentDetail(id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.status(200).json({
        success: true,
        student
    });
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const reviewerId = req.user.id;

    if (!id) {
        res.status(400);
        throw new Error('Student ID is required');
    }

    if (typeof status !== 'boolean') {
        res.status(400);
        throw new Error('Status must be a boolean value');
    }

    const updatedStudent = await setStudentStatus({
        userId: id,
        reviewerId,
        status
    });

    if (!updatedStudent) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.status(200).json({
        success: true,
        data: updatedStudent
    });
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
