import React from 'react'

const Input = (props) => {
  return (<>
    <label htmlFor={props.id} className={props.class}>
    Password
  </label>
  <input
    type={props.type}
    name={props.name}
    value={props.form.formData.Password}
    onChange={props.handleChange}
    placeholder={props.placeholder}
    required
    className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
  /></>
  )
}

export default Input