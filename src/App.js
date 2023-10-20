import { useEffect, useState } from "react";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import { Row, Col, Card, Form, Container, Button } from "react-bootstrap";

const App = () => {
	const studentIntialState = {
		id: null,
		name: "",
		age: "",
		subjects: [],
		extraSubjects: false
	};
	const [students, setStudents] = useState([]);
	const [edit, setEdit] = useState(false);
	const [currentStudent, setCurrentStudent] = useState(studentIntialState);

	useEffect(() => {
		let savedStudents = localStorage.getItem('students');
		if (savedStudents !== null) {
			setStudents(JSON.parse(savedStudents))
		}
	}, [])

	const handleInputChange = (e) => {
		setCurrentStudent((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	const handleSubjectsChange = (data) => {
		setCurrentStudent((prev) => {
			return { ...prev, subjects: data };
		});
	};

	const handleExtraSubjectsChange = (data) => {
		setCurrentStudent((prev) => {
			return { ...prev, extraSubjects: data };
		});
	};

	const addStudentFormHandler = (e) => {
		e.preventDefault();

		if (currentStudent.id === null) {
			let updatedStudents = [...students, { ...currentStudent, id: uuidv4() }];
			setStudents(updatedStudents);
			localStorage.setItem("students", JSON.stringify(updatedStudents));
		} else {
			let studentIndex = students.findIndex(
				(stu) => stu.id === currentStudent.id
			);
			students[studentIndex] = currentStudent;
			localStorage.setItem("students", JSON.stringify(students));
		}
		setCurrentStudent(studentIntialState);
		setEdit(false);
	};

	const setEditMode = (id) => {
		setEdit(true);
		let studentIndex = students.findIndex((stu) => stu.id === id);
		if (studentIndex !== -1) {
			setCurrentStudent(students[studentIndex]);
		} else {
			alert("student not found!");
		}
	};

	const options = [
		{ value: 1, label: "Hindi" },
		{ value: 2, label: "English" },
		{ value: 3, label: "Maths" },
		{ value: 4, label: "Computer Science" }
	];

	return (
		<Container className="mt-3">
			<Row>
				<Col>
					<Form onSubmit={addStudentFormHandler}>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								name="name"
								value={currentStudent.name}
								placeholder="Alice"
								onChange={handleInputChange}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Age</Form.Label>
							<Form.Control
								type="text"
								name="age"
								onChange={handleInputChange}
								value={currentStudent.age}
								placeholder="25"
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Subjects</Form.Label>
							<Select
								closeMenuOnSelect={false}
								options={options}
								isMulti
								name="extraSubjects"
								value={currentStudent.subjects}
								onChange={(data) => handleSubjectsChange(data)}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Extra Subjects</Form.Label>
							{currentStudent && (
								<Form.Check
									type={"radio"}
									label={"Yes"}
									id={"for-yes"}
									name="extra_subjects"
									onChange={(e) => handleExtraSubjectsChange(true)}
									checked={currentStudent?.extraSubjects === true}
								/>
							)}
							{currentStudent && (
								<Form.Check
									type={"radio"}
									label={"No"}
									id={"for-no"}
									name="extra_subjects"
									onChange={(e) => handleExtraSubjectsChange(false)}
									checked={currentStudent?.extraSubjects === false}
								/>
							)}
						</Form.Group>
						<Form.Group>
							<Button type={"submit"}>{!edit ? "Add" : "Edit"} Student</Button>
						</Form.Group>
					</Form>
				</Col>
				<Col>
					{students.map((student) => (
						<Card
							className="student_card"
							key={student.id}
							onClick={() => setEditMode(student.id)}
						>
							<Card.Body>
								<p>Name: {student.name} </p>
								<p>Age: {student.age}</p>
								Subjects:
								<ul>
									{student.subjects.map((subject) => (
										<li key={subject.value}>{subject.label}</li>
									))}
								</ul>
								<p>
									Eng Extra Subjects:{" "}
									{student.extraSubjects === true ? "Yes" : "No"}
								</p>
							</Card.Body>
						</Card>
					))}
				</Col>
			</Row>
		</Container>
	);
}

export default App