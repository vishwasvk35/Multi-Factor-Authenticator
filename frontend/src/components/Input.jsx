function Input( props) {
  return (
    <div className="w-full p-3 border bg-gray-900 bg-opacity-30 border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex gap-3" >
        <div>
            <props.Icon className="text-blue-600" />
        </div>
      <input
       className="appearance-none border-none outline-none bg-transparent p-0 text-white"
        type= {props.text} 
        placeholder= {props.placeholder}
        onChange={props.onChange}
      />
    </div>
  );
}

export default Input;