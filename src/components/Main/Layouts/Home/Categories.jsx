import react from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function Categories(){
    return(
        <div>
            <h3 className="text-center">Categories</h3>
            <DropdownButton id="dropdown-basic-button" title="Renting Bordings">
                <Dropdown.Item href="#/action-1">For Boys</Dropdown.Item>
                <Dropdown.Item href="#/action-2">For Girls</Dropdown.Item>
            </DropdownButton>

            <DropdownButton id="dropdown-basic-button" title="Renting Cycles">
                <Dropdown.Item href="#/action-1">For Boys</Dropdown.Item>
                <Dropdown.Item href="#/action-2">For Girls</Dropdown.Item>
            </DropdownButton>

            <DropdownButton id="dropdown-basic-button" title="Selling Items">
                <Dropdown.Item href="#/action-1">Smartphones</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Laptops</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Mobile Accessories</Dropdown.Item>
                <Dropdown.Item href="#/action-4">Peripherals</Dropdown.Item>
                <Dropdown.Item href="#/action-5">Others</Dropdown.Item>
            </DropdownButton>

            <DropdownButton id="dropdown-basic-button" title="Renting Items">
                <Dropdown.Item href="#/action-1">Camera</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Others</Dropdown.Item>
            </DropdownButton>

            <DropdownButton id="dropdown-basic-button" title="Services">
                <Dropdown.Item href="#/action-1">Food Delivery</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Saloon</Dropdown.Item>
            </DropdownButton>
        </div>
    );
}

export default  Categories;