import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './Categories.module.css';

function Categories(){
    return(
        <div className={styles.categoryContainer}>
            <h3 className={styles.heading}>Filters</h3>
            <div className={styles.dropdownButton}>
                <DropdownButton id="dropdown-basic-button" title="Renting Bordings" className={styles.btn}>
                    <Dropdown.Item href="#/action-1">For Boys</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">For Girls</Dropdown.Item>
                </DropdownButton>
            </div>

            <div className={styles.dropdownButton}>
                <DropdownButton id="dropdown-basic-button" title="Renting Cycles" className={styles.btn}>
                    <Dropdown.Item href="#/action-1">For Boys</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">For Girls</Dropdown.Item>
                </DropdownButton>
            </div>

            <div className={styles.dropdownButton}>
                <DropdownButton id="dropdown-basic-button" title="Selling Items" className={styles.btn}>
                    <Dropdown.Item href="#/action-1">Smartphones</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Laptops</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Mobile Accessories</Dropdown.Item>
                    <Dropdown.Item href="#/action-4">Peripherals</Dropdown.Item>
                    <Dropdown.Item href="#/action-5">Others</Dropdown.Item>
                </DropdownButton>
            </div>

            <div className={styles.dropdownButton}>
                <DropdownButton id="dropdown-basic-button" title="Renting Items" className={styles.btn}>
                    <Dropdown.Item href="#/action-1">Camera</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Others</Dropdown.Item>
                </DropdownButton>
            </div>

            <div className={styles.dropdownButton}>
                <DropdownButton id="dropdown-basic-button" title="Services" className={styles.btn}>
                    <Dropdown.Item href="#/action-1">Food Delivery</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Saloon</Dropdown.Item>
                </DropdownButton>
            </div>
        </div>
    );
}

export default  Categories;