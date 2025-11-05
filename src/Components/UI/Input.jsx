function Input(props){
    return(
        <input type="text" className="flex w-full w-fullborder px-3 py-2 h-12 bg-secondary border-gray-200 focus:border-primary focus:ring-primary rounded-xl text-base"
        style={{background:"hsl(219, 33%, 25%)"}}
        placeholder={props.placeholder}
        onKeyPress={props.onKeyPress}
        onChange={props.onChange}
        >
            {props.children}
        </input>
    )
}

export default Input;