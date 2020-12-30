import React, { useState } from "react";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	UncontrolledDropdown,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
} from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	return (
		<div>
			<Navbar color="light" light expand="md">
				<NavbarBrand href="/">
					<img src={logo} className="navbar_logo" alt="spring-action-logo" />
				</NavbarBrand>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="ml-auto d-flex justify-content-end navItems" navbar>
						<NavItem className="mr-md-5 pb-2 pt-2 pb-md-0 pt-md-0 text-center">
							<Link
								className="text-decoration-none link text-secondary "
								to="/customers"
							>
                Client{" "}
							</Link>
						</NavItem>
						<NavItem className="mr-md-5 pb-2 pt-2 pb-md-0 pt-md-0 text-center">
							<Link
								className="text-decoration-none link text-secondary "
								to="/workers"
							>
                Cleaners{" "}
							</Link>
						</NavItem>
						<NavItem className="mr-md-5 pb-2 pt-2 pb-md-0 pt-md-0 text-center">
							<Link
								className="text-decoration-none link text-secondary "
								to="/jobs"
							>
                Jobs
							</Link>
						</NavItem>
						<NavItem className="mr-md-5 pb-2 pt-2 pb-md-0 pt-md-0 text-center">
							<UncontrolledDropdown
								nav
								inNavbar
								className="text-decoration-none link text-secondary "
							>
								<DropdownToggle nav caret className="p-0">
                  Reports
								</DropdownToggle>
								<DropdownMenu right>
									<DropdownItem>
										<Link
											className="text-decoration-none link text-secondary "
											to="/workers_report"
										>
                      Cleaners
										</Link>
									</DropdownItem>
									<DropdownItem>
										<Link
											className="text-decoration-none link text-secondary "
											to="/customers_report"
										>
                      Clients
										</Link>
									</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
		</div>
	);
};

export default Navigation;