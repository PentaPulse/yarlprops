import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

function SearchAndFilters() {
  return (
    <div>
        <InputGroup className='mb-3'>
          <Form.Control aria-label='search'/>
          <InputGroup.Text className='btn btn-transparent'>Search</InputGroup.Text>
        </InputGroup>
    </div>
  )
}

export default SearchAndFilters
