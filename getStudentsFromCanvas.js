const canvas = require('canvas-api-wrapper');
module.exports = async function (courseId) {
    return canvas.get(`/api/v1/courses/${courseId}/users`, {
        'enrollment_type[]': 'student'
    });
}