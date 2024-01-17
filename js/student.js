const apiUrl = "https://65a73dbb94c2c5762da654c1.mockapi.io/api/students";

async function fetchStudents() {
    try {
        const response = await fetch(apiUrl);
        const students = await response.json();
        return students;
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}

async function saveStudent(student) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        });
        const savedStudent = await response.json();
        return savedStudent;
    } catch (error) {
        console.error("Error saving student:", error);
        return null;
    }
}

async function deleteStudent(studentID) {
    const confirmDelete = confirm("Bạn có chắc muốn xóa sinh viên này?");
 
    if (!confirmDelete) {
        return false;
    }

    try {
        const response = await fetch(`${apiUrl}/${studentID}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            renderListStudent(); 
            return true;
        } else {
            console.error("Error deleting student. Status:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Error deleting student:", error);
        return false;
    }
}
    

function emailIsValid(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function phoneIsValid(phone) {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone);
}

async function save() {
    let fullname = document.getElementById('fullname').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let gender = '';
    if (document.getElementById('male').checked) {
        gender = document.getElementById('male').value;
    } else if (document.getElementById('female').checked) {
        gender = document.getElementById('female').value;
    }

    if (_.isEmpty(fullname)) {
        fullname = '';
        document.getElementById('fullname-error').innerHTML = 'Vui lòng nhập họ tên!';
    } else if (fullname.trim().length <= 2) {
        fullname = '';
        document.getElementById('fullname-error').innerHTML = 'Không được nhỏ hơn 2 ký tự!';
    } else if (fullname.trim().length > 50) {
        fullname = '';
        document.getElementById('fullname-error').innerHTML = 'Không được lớn hơn 50 ký tự!';
    } else {
        document.getElementById('fullname-error').innerHTML = '';
    }

    if (_.isEmpty(email)) {
        email = '';
        document.getElementById('email-error').innerHTML = 'Vui lòng nhập Email!';
    } else if (!emailIsValid(email)) {
        email = '';
        document.getElementById('email-error').innerHTML = 'Email không đúng định dạng!';
    } else {
        document.getElementById('email-error').innerHTML = '';
    }

    if (_.isEmpty(phone)) {
        phone = '';
        document.getElementById('phone-error').innerHTML = 'Vui lòng nhập SĐT!';
    } else if (!phoneIsValid(phone)) {
        phone = '';
        document.getElementById('phone-error').innerHTML = 'SĐT không đúng';
    } else {
        document.getElementById('phone-error').innerHTML = '';
    }

    if (_.isEmpty(gender)) {
        gender = '';
        document.getElementById('gender-error').innerHTML = 'Vui chọn giới tính!';
    } else {
        document.getElementById('gender-error').innerHTML = '';
    }

    if (fullname && email && phone && gender) {
        // Lưu danh sách
        const newStudent = {
            name: fullname, 
            email: email,
            phone: phone,
            gender: gender,
        };

        const savedStudent = await saveStudent(newStudent);

        if (savedStudent) {
            renderListStudent();
        }
    }
}

async function renderListStudent() {
    const students = await fetchStudents();

    let tableContent = `<tr>
            <td>#</td>
            <td>Họ và tên</td>
            <td>Email</td>
            <td>Điện thoại</td>
            <td>Giới tính</td>
            <td>Hành động</td>
            </tr>`;

    students.forEach((student, index) => {
        let studentID = student.id;
        index++;

        let genderLabel = determineGenderLabel(student);

        tableContent += `<tr>
            <td>${index}</td>
            <td class="student-name" onclick="displayStudentInfo(${studentID})">${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${genderLabel}</td>
            <td>
                <a href="#" class="delete-link" onclick='deleteStudent(${studentID})'>Xóa</a>
            </td>
            </tr>`;
    });

    document.getElementById('grid-students').innerHTML = tableContent;
}

async function displayStudentInfo(studentID) {
    try {
        const response = await fetch(`${apiUrl}/${studentID}`);
        const student = await response.json();

        let genderLabel = determineGenderLabel(student);

        
        alert(`Thông tin sinh viên:
            Họ và tên: ${student.name}
            Email: ${student.email}
            Điện thoại: ${student.phone}
            Giới tính: ${genderLabel}`);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin sinh viên:", error);
    }
}


function determineGenderLabel(student) {
    return student.gender ? 'Nam' : 'Nữ';
}


