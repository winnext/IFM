import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

export const Login = () => {

    return (
        <div className="login-body">
            <div className="login-wrapper">
                <div className="login-panel">
                    <img src="assets/layout/images/logo-dark.svg" className="logo" alt="diamond-layout" />

                    <div className="login-form">
                        <h2>Login</h2>
                        <p>Already have an account? <a href="/">Login</a></p>
                        <InputText placeholder="Full Name" />
                        <InputText placeholder="Email" />
                        <Password placeholder="Password" />
                        <Button label="CONTINUE" type="button"></Button>
                    </div>

                    <p>A problem? <a href="/">Click here</a> and let us help you.</p>
                </div>
                <div className="login-image">
                    <div className="login-image-content">
                        <h1>Access to your</h1>
                        <h1>Diamond</h1>
                        <h1>Account</h1>
                        <h3>
                            Lorem ipsum dolor sit amet, consectetur <br />
						adipiscing elit. Donec posuere velit nec enim <br />
						sodales, nec placerat erat tincidunt.
					</h3>
                    </div>
                    <div className="image-footer">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <div className="icons">
                            <i className="pi pi-github"></i>
                            <i className="pi pi-twitter"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
