const GenderCheckbox = ({selectedGender, handleCheckboxChange} : {
    selectedGender: string,
    handleCheckboxChange: (gender: "male" | "female") => void
}) => {
    return (
        <div className="flex">
            <div className="form-control">
                <label className={`label gap-2 cursor-pointer`}>
                    <span className="label-text">Male</span>
                    <input type="checkbox" className="checkbox border-slate-900"
                    checked={selectedGender == "male"} 
                    onChange={() => handleCheckboxChange("male")}/>
                </label>
            </div>
            <div className="form-control">
                <label className={`label gap-2 cursor-pointer`}>
                    <span className="label-test">Female</span>
                    <input type="checkbox" className="checkbox border-slate-dom"
                    checked={selectedGender == "female"}
                    onChange={() => handleCheckboxChange("female")}/>
                </label>
            </div>
        </div>
    )
}

export default GenderCheckbox;