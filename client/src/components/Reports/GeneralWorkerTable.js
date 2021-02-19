import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const GeneralWorkerTable = ({ data, state, setState, tableFooter }) => {
	const history = useHistory();

	const formatDuration = (h = 0, m = 0) => {
		return ("00" + h).slice(-2) + ":" + ("00" + m).slice(-2);
	};

	const handleClick = (id, worker) => {
		setState({ ...state, worker_id: id, worker });
		history.push("/result/worker");
	};

	const handleKeyPress = (id, worker, e) => {
		setState({ ...state, worker_id: id, worker });
		if (e.key === "Enter" && e.target.tagName === "TR") {
			history.push("/result/worker");
		}
	};

	return (
		<tbody>
			{data.map(({ id, duration, actual_duration, worker }) => (
				<tr
					key={id || 0} //In the case of displaying the final line, use 0 for the key and prohibit actions.
					role={id && "button"}
					onClick={() => id && handleClick(id, worker)}
					onKeyPress={(e) => id && handleKeyPress(id, worker, e)}
					tabIndex={id && 0}
				>
					<th
						scope="row"
						className={tableFooter && "font-weight-bold text-right"}
					>
						{tableFooter ? "Total duration:" : worker}
					</th>
					<td className={tableFooter && "font-weight-bold"}>
						{formatDuration(duration)}
					</td>
					<td className={tableFooter && "font-weight-bold"}>
						{formatDuration(actual_duration.hours, actual_duration.minutes)}
					</td>
				</tr>
			))}
		</tbody>
	);
};

GeneralWorkerTable.propTypes = {
	data: PropTypes.array,
	tableFooter: PropTypes.bool,
	state: PropTypes.object,
	setState: PropTypes.func,
};

export default GeneralWorkerTable;