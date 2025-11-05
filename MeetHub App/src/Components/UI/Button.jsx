function Button({style, children, onClick}){
    return(
        <button style={style} className="inline-flex items-center justify-center gap-2 whitespace-narrow ring-offset-background focus:visible:outline-none
        focus-visible:ring-offset-2 disabled:pointer-events-none px-4 py-2 w-full h-14 text-basefont-medium bg-gradient-primary" onClick={onClick} >
            {children}
        </button>
    )
}

export default Button