import React from "react";
import PropTypes from "prop-types";
import { JobsProvider } from "./Jobs";
import { RecurringJobsProvider } from "./RecurringJobs";
import { CustomerReportProvider } from "./CustomerReport";
import { BranchReportProvider } from "./BranchReport";
import { WorkerReportProvider } from "./WorkerReport";
import { WorkerJobsProvider } from "./WorkerJobs";

const ContextProviders = ({ children }) => {
	return (
		<JobsProvider>
			<RecurringJobsProvider>
				<WorkerReportProvider>
					<BranchReportProvider>
						<WorkerJobsProvider>
							<CustomerReportProvider>{children}</CustomerReportProvider>
						</WorkerJobsProvider>
					</BranchReportProvider>
				</WorkerReportProvider>
			</RecurringJobsProvider>
		</JobsProvider>
	);
};

ContextProviders.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ContextProviders;
