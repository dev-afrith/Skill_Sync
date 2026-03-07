const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.dropoutRisk.deleteMany({});
    await prisma.studentSkill.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Seeding data...');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin.admin@skillsync.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Faculty members from adminData.ts
    const facultyData = [
        { name: "Dr. Sarah Smith", email: "sarahsmith.faculty@skillsync.com" },
        { name: "Prof. Raj Kumar", email: "rajkumar.faculty@skillsync.com" },
        { name: "Dr. Priya Nair", email: "priyanair.faculty@skillsync.com" },
        { name: "Prof. Anil Sharma", email: "anilsharma.faculty@skillsync.com" },
    ];

    const faculty = await Promise.all(facultyData.map(f =>
        prisma.user.create({
            data: {
                name: f.name,
                email: f.email,
                password: hashedPassword,
                role: 'FACULTY',
            }
        })
    ));

    // Students from mockData.ts
    const studentData = [
        { name: "Aarav Sharma", email: "aaravsharma.student@skillsync.com" },
        { name: "Priya Mehta", email: "priyamehta.student@skillsync.com" },
        { name: "Rohan Das", email: "rohandas.student@skillsync.com" },
        { name: "Sneha Iyer", email: "snehaiyer.student@skillsync.com" },
        { name: "Kiran Patel", email: "kiranpatel.student@skillsync.com" },
        { name: "Divya Nair", email: "divyanair.student@skillsync.com" },
        { name: "John Doe", email: "johndoe.student@skillsync.com" },
    ];

    const students = await Promise.all(studentData.map(s =>
        prisma.user.create({
            data: {
                name: s.name,
                email: s.email,
                password: hashedPassword,
                role: 'STUDENT',
            }
        })
    ));

    // Create Courses
    const courses = await Promise.all([
        prisma.course.create({
            data: {
                title: 'Data Structures & Algorithms',
                description: 'Core concepts of DSA with industry-level problem solving.',
                facultyId: faculty[0].id,
            },
        }),
        prisma.course.create({
            data: {
                title: 'Machine Learning Fundamentals',
                description: 'Introduction to AI and ML using Python.',
                facultyId: faculty[0].id,
            },
        }),
    ]);

    // Create Skills (Industry Skills)
    const skills = await Promise.all([
        prisma.skill.create({ data: { name: 'React.js', category: 'Frontend', demandLevel: 5 } }),
        prisma.skill.create({ data: { name: 'Node.js', category: 'Backend', demandLevel: 4 } }),
        prisma.skill.create({ data: { name: 'Python', category: 'Data Science', demandLevel: 5 } }),
        prisma.skill.create({ data: { name: 'Cloud Computing', category: 'DevOps', demandLevel: 4 } }),
    ]);

    // Enroll Students and add Skills
    for (const student of students) {
        for (const course of courses) {
            const isWeak = Math.random() < 0.3;
            await prisma.enrollment.create({
                data: {
                    studentId: student.id,
                    courseId: course.id,
                    grade: isWeak ? 45 + Math.random() * 20 : 75 + Math.random() * 20,
                    attendance: isWeak ? 60 + Math.random() * 20 : 85 + Math.random() * 15,
                    assignmentCompletion: isWeak ? 50 + Math.random() * 30 : 80 + Math.random() * 20,
                },
            });
        }

        // Add random skills
        for (const skill of skills) {
            await prisma.studentSkill.create({
                data: {
                    studentId: student.id,
                    skillId: skill.id,
                    proficiency: 20 + Math.random() * 60,
                },
            });
        }

        // Predict Dropout Risk
        const avgGrade = (await prisma.enrollment.findMany({ where: { studentId: student.id } }))
            .reduce((acc, curr) => acc + (curr.grade || 0), 0) / courses.length;

        const riskLevel = avgGrade < 60 ? 'HIGH' : avgGrade < 75 ? 'MEDIUM' : 'LOW';
        const probability = avgGrade < 60 ? 0.8 : avgGrade < 75 ? 0.4 : 0.1;

        await prisma.dropoutRisk.create({
            data: {
                studentId: student.id,
                riskLevel,
                probability,
                reason: riskLevel !== 'LOW' ? 'Low grade average and irregular attendance.' : 'Consistent performance.',
            },
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
