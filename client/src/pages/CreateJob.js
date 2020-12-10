import React from "react";
import { Container } from "reactstrap";
import { CreateJobForm } from "../components";

const CreateJob = () => {

	return (
		<Container>
			<h2 className="text-center mt-4 mt-md-5 mb-5 mb-md-5">
				Add a new job offer
			</h2>
			<CreateJobForm />
		</Container>
	);
};

export default CreateJob;