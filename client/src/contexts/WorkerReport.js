import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const WorkerReportContext = createContext([{}, () => {}]);

export const WorkerReportProvider = ({ children }) => {
	const [state, setState] = useState({
		worker: "",
		worker_id: "",
		start_date: "",
		finish_date: "",
	});

	return (
		<WorkerReportContext.Provider value={[state, setState]}>
			{children}
		</WorkerReportContext.Provider>
	);
};

WorkerReportProvider.propTypes = {
	children: PropTypes.node.isRequired,
};