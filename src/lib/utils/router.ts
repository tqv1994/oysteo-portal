export const redirect = (endpoint: string, delay: number = 0) => {
	setTimeout(()=>{
		window.location.href = endpoint;
	}, delay);
};
