export const setup = (server: any) => {
	server.get(
		"/api/timestamp/:date_string?",
		(
			req: { params: { date_string: string | number | Date } },
			res: { json: (arg0: { unix: number; utc: string }) => any }
		) => {
			var reqDate = new Date(req.params.date_string);
			var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();

			var response = {
				unix: responseDate.getTime(),
				utc: responseDate.toUTCString(),
			};
			return res.json(response);
		}
	);
};
