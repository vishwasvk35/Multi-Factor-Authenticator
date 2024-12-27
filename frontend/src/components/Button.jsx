function Button(props) {
  return (
    <div>
      <button
        type={props.type}
        className="w-full bg-blue-500  text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-medium"
      >
        {props.placeholder}
      </button>
    </div>
  );
}

export default Button;