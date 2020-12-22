/* eslint-disable operator-linebreak */
import { Router } from "express";
import { body, check, validationResult } from "express-validator";
import db from "../db";
import formatJobs from "../util/formatJobs";

const router = new Router();

router.get("/jobs/:id", (req, res, next) => {
	const { id } = req.params;

	db.query(
		`
	SELECT j.*, c.name customer, b.address branch, w.name worker
	FROM jobs j
	INNER JOIN customers c ON j.customer_id=c.id
	INNER JOIN branches b ON j.branch_id=b.id
	INNER JOIN workers w ON j.worker_id=w.id
	WHERE j.id=$1`,
		[id]
	)
		.then(({ rows }) => {
			return res.json({ success: true, job: rows[0] });
		})
		.catch((e) => {
			console.error(e);
			next(e);
		});
});

router.get("/jobs", (_, res, next) => {
	db.query(
		`SELECT j.*, b.address, c.name customer, w.name worker
		FROM jobs j 
		INNER JOIN branches b ON j.branch_id=b.id 
		INNER JOIN customers c ON j.customer_id=c.id
		INNER JOIN workers w ON w.id=j.worker_id`
	)
		.then(({ rows }) => {
			return res.json({ jobs: formatJobs(rows) });
		})
		.catch((e) => {
			console.error(e);
			next(e);
		});
});

router.get("/jobs/customers/:id", async (req, res, next) => {
	const { id } = req.params;
	const client = await db.getClient();

	try {
		// customer has main branch and default worker
		const fullJobDetails = await client.query(
			`SELECT c.name customer_name, b.address, b.visit_time, b.duration, b.id branch_id, w.name worker_name, w.id worker_id
			FROM customers c
			INNER JOIN branches b ON c.id=b.customer_id
			INNER JOIN workers w ON w.id=b.worker_id
			WHERE c.id=$1 AND b.id=c.main_branch_id`,
			[id]
		);
		if (fullJobDetails.rows < 1) {
			// customer has main branch but no default worker
			const jobDetailsBranch = await client.query(
				`
				SELECT c.name customer_name, b.address, b.visit_time, b.duration, b.id branch_id
				FROM customers c
				INNER JOIN branches b ON c.id=b.customer_id
				WHERE c.id=$1 AND b.id=c.main_branch_id
			`,
				[id]
			);

			if (jobDetailsBranch.rows < 1) {
				// customer doesn't have main branch
				const jobDetailsNoBranch = await client.query(
					`
					SELECT c.name customer_name
					FROM customers c
					WHERE c.id=$1
					`,
					[id]
				);
				return res.json({ rows: jobDetailsNoBranch.rows });
			} else {
				return res.json({ rows: jobDetailsBranch.rows });
			}
		} else {
			return res.json({ rows: fullJobDetails.rows });
		}
	} catch (e) {
		next(e);
	} finally {
		client.release();
	}
});

router.get("/jobs/branches/:id", async (req, res, next) => {
	const { id } = req.params;
	const client = await db.getClient();

	try {
		// branch has default worker
		const branchDetailsFull = await client.query(
			`SELECT b.address, b.visit_time, b.duration, b.id branch_id, w.name worker_name, w.id worker_id
			FROM branches b
			INNER JOIN workers w ON w.id=b.worker_id
			WHERE b.id=$1`,
			[id]
		);
		if (branchDetailsFull.rows < 1) {
			// branch don't have default worker
			const branchDetailsNoDefaultWorker = await client.query(
				`
				SELECT b.address, b.visit_time, b.duration, b.id branch_id
				FROM branches b
				WHERE b.id=$1
			`,
				[id]
			);

			return res.json({ rows: branchDetailsNoDefaultWorker.rows });
		} else {
			return res.json({ rows: branchDetailsFull.rows });
		}
	} catch (e) {
		next(e);
	} finally {
		client.release();
	}
});

router.get("/jobs/workers/:id", async (req, res, next) => {
	const { id } = req.params;
	const client = await db.getClient();

	try {
		const workerDetails = await client.query(
			`SELECT w.name worker_name, w.id worker_id
			FROM workers w
			WHERE w.id=$1`,
			[id]
		);
		return res.json({ rows: workerDetails.rows });
	} catch (e) {
		next(e);
	} finally {
		client.release();
	}
});

router.post(
	"/jobs",
	[
		body("customer_id", "Customer id is required").not().isEmpty(),
		body("customer", "Client is required").not().isEmpty(),
		body("branch_id", "Branch id is required").not().isEmpty(),
		body("branch", "Address is required").not().isEmpty(),
		body("worker_id", "Worker id is required").exists(),
		body("worker", "Cleaner is required").not().isEmpty(),
		body("details", "Details are required").exists(),
		body("visit_on", "Visit date is required").not().isEmpty(),
		body(
			"visit_time",
			"Start time is not in a format of HH:MM (24h clock)"
		).custom((value) =>
			/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(value)
		),
		body("visit_time", "Visit time is required").not().isEmpty(),
		body(
			"pay_rate",
			"Pay rate is not in a format of 10.50 or 10"
		).custom((value) => /^\d+(\.\d+)?$/.test(value)),
		body("pay_rate", "Pay rate is required").exists(),
		body("duration", "Duration is required").exists(),
		body(
			"start_time",
			"Start time is not in a format of HH:MM (24h clock)"
		).custom(
			(value) =>
				value === undefined ||
				/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(value)
		),
		body("end_time", "End time is not in a format of HH:MM (24h clock)").custom(
			(value) =>
				value === undefined ||
				/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(value)
		),
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(200).json({ success: false, errors: errors.array() });
		}

		const {
			customer_id,
			branch_id,
			worker_id,
			details,
			visit_on,
			visit_time,
			pay_rate,
			duration,
			start_time,
			end_time,
		} = req.body;

		const date = new Date();

		const status = start_time && end_time ? 1 : 0;

		db.query(
			`INSERT INTO jobs (customer_id, branch_id, worker_id, details, visit_on, visit_time, pay_rate, date_created, duration, start_time, end_time, status)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
			[
				customer_id,
				branch_id,
				worker_id,
				details,
				visit_on,
				visit_time,
				pay_rate,
				date,
				duration,
				start_time,
				end_time,
				status,
			]
		)
			.then(({ rowCount }) => {
				if (rowCount < 1) {
					return res
						.status(400)
						.json({ success: false, message: "Job not added." });
				} else {
					return res.json({ success: true });
				}
			})
			.catch((e) => {
				console.error(e);
				next(e);
			});
	}
);

router.put(
	"/jobs/:id",
	[
		body("customer_id", "Please provide a customer id").not().isEmpty(),
		body("branch_id", "Please provide a branch id").not().isEmpty(),
		body("worker_id", "Please provide a worker id").not().isEmpty(),
		body("details", "Details is required").exists(),
		body("visit_on", "Visit date is required").not().isEmpty(),
		body(
			"visit_time",
			"Start time is not in a format of HH:MM (24h clock)"
		).custom((value) =>
			/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(value)
		),
		body("visit_time", "Visit time is required").not().isEmpty(),
		body(
			"pay_rate",
			"Pay rate is not in a format of 10.50 or 10"
		).custom((value) => /^\d+(\.\d+)?$/.test(value)),
		body("pay_rate", "Pay rate is required").not().isEmpty(),
		body("duration", "Duration is required").exists(),
		body(
			"start_time",
			"Start time is not in a format of HH:MM (24h clock)"
		).custom(
			(value) =>
				value === undefined ||
				/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(value)
		),
		body("end_time", "End time is not in a format of HH:MM (24h clock)").custom(
			(value) =>
				value === undefined ||
				/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(value)
		),
	],
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(200).json({ success: false, errors: errors.array() });
		}

		const { id } = req.params;
		const {
			customer_id,
			branch_id,
			worker_id,
			details,
			visit_on,
			visit_time,
			pay_rate,
			duration,
			start_time,
			end_time,
		} = req.body;

		const status = start_time && end_time ? 1 : 0;

		db.query(
			`
				UPDATE jobs 
				SET customer_id=$1, branch_id=$2, worker_id=$3, details=$4, visit_on=$5, visit_time=$6, pay_rate=$7, duration=$8, start_time=$9, end_time=$10, status=$11
				WHERE id=$12
			`,
			[
				customer_id,
				branch_id,
				worker_id,
				details,
				visit_on,
				visit_time,
				pay_rate,
				duration,
				start_time,
				end_time,
				status,
				id,
			]
		)
			.then(({ rowCount }) => {
				if (rowCount < 1) {
					return res
						.status(400)
						.json({ success: false, message: "Job not added." });
				} else {
					return res.json({ success: true });
				}
			})
			.catch((e) => {
				console.error(e);
				next(e);
			});
	}
);

router.put(
	"/jobs/:id/log_time",
	[
		body("start_time", "Please provide a start time").not().isEmpty(),
		body("end_time", "Please provide an end time").not().isEmpty(),
		check("start_time", "End time should be greater than start time")
			.exists()
			.custom((value, { req }) => value < req.body.end_time),
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(200).json({ success: false, errors: errors.array() });
		}

		const { id } = req.params;
		const { start_time, end_time } = req.body;

		db.query(
			`
				UPDATE jobs 
				SET start_time=$1, end_time=$2, status=1
				WHERE id=$3
			`,
			[start_time, end_time, id]
		)
			.then(({ rowCount }) => {
				if (rowCount < 1) {
					return res
						.status(400)
						.json({ success: false, message: "Job not updated." });
				} else {
					return res.json({ success: true });
				}
			})
			.catch((e) => {
				console.error(e);
				next(e);
			});
	}
);

export default router;
