import React from 'react';
import { useEffect } from 'react'

interface ReplAuthProps {
	buttonClass?: string;
	buttonText?: string;
	authed?: () => void;
	errorClass?: string;
	debug?: boolean;
}
const ReplAuth: React.FC<ReplAuthProps> = (props: ReplAuthProps) => {
	let buttonText = "Login With Replit";
	let buttonClass = props.buttonClass ? props.buttonClass + " replit-auth-button" : "replit-auth-button ";
	let error = "";
	
	useEffect(function mount() {
		if(props.buttonText) buttonText = props.buttonText;
		if(window.location.protocol !== 'https:') 
			error = "Replit Auth requires HTTPS!";
		console.log("Repl Auth Mounted")
	});

	const processAuth = () => {
		window.addEventListener('message', authComplete);
		let h = 500;
		let w = 350;

		var left = (screen.width / 2) - ( w / 2);
		var top = (screen.height / 2) - (h / 2);

		let authURL = 'https://replit.com/auth_with_repl_site?domain='+location.host;
		let authFeatures = 'modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left;
    let authWindow = window.open(authURL, '_blank', authFeatures);

		function authComplete (e) {
			if (e.data !== 'auth_complete') return;
			console.log("Repl Auth Completed")
			window.removeEventListener('message', authComplete);
			authWindow.close();
			if(props.authed) eval(props.authed.value);
			else window.location.reload();
		}
	}

	const authed = () => {
		if(!props.authed) window.location.reload();
		else props.authed();
	}
	if(error.length > 0) return <p className={props.errorClass}>{error}</p>;

	return (
		<button className={buttonClass} onClick={processAuth} authed={authed}>{props.children ? props.children : buttonText}</button>
	)
	
}

export default ReplAuth
