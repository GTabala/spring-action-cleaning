import React, { useContext } from "react";
import { Button, Table, FormGroup } from "reactstrap";
import useFetch from "../../hooks/useFetch";
import Spinner from "../UI/Spinner";
import WorkerJobsTableBody from "./WorkerJobsTableBody";
import DateFilter from "../Jobs/DateFilter";
import { WorkerJobsContext } from "../../contexts/WorkerJobs";
import WorkerHelpModal from "./WorkerHelpModal";

const WorkerJobsList = () => {
	const [state, setState] = useContext(WorkerJobsContext);

	const { isLoading, error, data } = useFetch("workers/jobs");

	const { startDate, endDate } = state;

	const filterByDate = (jobs) => {
		const afterStartTime = (time) => {
			if (!startDate) {
				return true;
			}
			const visitTime = new Date(time).getTime();
			const startTime = new Date(startDate).getTime();
			return visitTime >= startTime;
		};

		const beforeEndTime = (time) => {
			if (!endDate) {
				return true;
			}

			const visitTime = new Date(time).getTime();
			const endTime = new Date(endDate).getTime();
			return visitTime <= endTime;
		};

		return jobs.filter(
			(job) => afterStartTime(job.visit_on) && beforeEndTime(job.visit_on)
		);
	};

	if (error) {
		return <div>Oops, something went wrong.</div>;
	}
	if (isLoading) {
		return <Spinner />;
	}

	if (data.jobs.length < 1) {
		return <p>You don&apos;t have assigned jobs yet.</p>;
	}

	const filteredDataByDate = filterByDate(data.jobs);
	return (
		<div>
			<div className="d-flex justify-content-between">
				<DateFilter state={state} setState={setState} />
				<FormGroup className="d-inline-block m-1">
				<Button color="link" className="mr-3">Report</Button>
				<WorkerHelpModal /></FormGroup>
			</div>
			{filteredDataByDate.length === 0 ? (
				<div className="mt-5">No jobs found for the specified time.</div>
			) : (
				<Table striped hover responsive>
					<thead>
						<tr>
							<th></th>
							<th>Address</th>
							<th>Date</th>
							<th>Time</th>
						</tr>
					</thead>
					<WorkerJobsTableBody data={filteredDataByDate} />
				</Table>
			)}
		</div>
	);
};

export default WorkerJobsList;
