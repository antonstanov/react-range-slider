import React from 'react';

export interface RangeInputProps { // todo
    name?: string;
    defaultValue?: number[];

    min?: number;
    max?: number;

    prefixCls?: string;
    className?: string;

    value?: number;
}

export default class RangeInput extends React.Component<RangeInputProps> {
    props: any;
    state: any;

    originalRageInput: any;

    startValueInput: any;
    endValueInput: any;

    descriptor: any;

    endHandle: any;
    startHandle: any;

    min: any;
    max: any;

    constructor(props: any) {
        super(props);
        this.state = {
            data: new Date(),
            values: [],
            min: null,
            max: null,
        }

        this.originalRageInput = React.createRef();

        this.startValueInput = React.createRef();
        this.endValueInput = React.createRef();

        // this.passClick = this.passClick.bind(this);

        this.update = this.update.bind(this);
        this.setValues = this.setValues.bind(this);

        this.startValueInputHandler = this.startValueInputHandler.bind(this)
        this.endValueInputHandler = this.endValueInputHandler.bind(this)
        this.startInputEventHandler = this.startInputEventHandler.bind(this)
        this.endInputEventHandler = this.endInputEventHandler.bind(this)
    }

    componentDidMount() {
        this.startValueInput.current.value = this.props.value[0];
        this.endValueInput.current.value = this.props.value[1];

        this.multirange();
    }

    componentWillUnmount() {}

    update() {
        this.endHandle.style.setProperty("--low", 100 * ((this.startHandle.valueLow - this.min) / (this.max - this.min)) + 1 + "%");
        this.endHandle.style.setProperty("--high", 100 * ((this.startHandle.valueHigh - this.min) / (this.max - this.min)) - 1 + "%");

        console.log([this.startValueInput.current.value, this.startHandle.value],
            [this.endValueInput.current.value, this.endHandle.value])
    }

    setValues() {
        this.props.onChange([this.startHandle.value, this.endHandle.value])

        this.startValueInput.current.value = this.startHandle.value;
        this.endValueInput.current.value = this.endHandle.value;
    }

    multirange() {
        this.startHandle = this.originalRageInput.current;
        this.endHandle = this.startHandle.cloneNode();
        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value") as any;

        const values = this.props.value;
        this.min = +(this.startHandle.min || 0);
        this.max = +(this.startHandle.max || 100);

        this.startHandle.classList.add("multirange");
        this.startHandle.classList.add("original");
        this.endHandle.classList.add("multirange");
        this.endHandle.classList.add("ghost");

        this.startHandle.value = values[0] || this.min + (this.max - this.min) / 2;
        this.endHandle.value = values[1] || this.min + (this.max - this.min) / 2;

        this.startHandle.parentNode.insertBefore(this.endHandle, this.startHandle.nextSibling);

        Object.defineProperty(this.startHandle, "originalValue", descriptor);

        Object.defineProperties(this.startHandle, {
            valueLow: {
                get: () => Math.min(this.startHandle.originalValue, this.endHandle.value),
                set: (v) => {
                    this.startHandle.originalValue = v;
                    this.update();
                },
                enumerable: true
            },
            valueHigh: {
                get: () => Math.max(this.startHandle.originalValue, this.endHandle.value),
                set: (v) => {
                    this.endHandle.value = v;
                    this.update();
                },
                enumerable: true
            }
        });

        // this.endHandle.addEventListener("mousedown", this.passClick);

        this.startHandle.addEventListener("mouseup", this.setValues)
        this.endHandle.addEventListener("mouseup", this.setValues)

        this.startHandle.addEventListener("input", this.startInputEventHandler);
        this.endHandle.addEventListener("input", this.endInputEventHandler);

        this.update();
    }

    // passClick(evt: any) {
    //     const clickValue = this.min + (this.max - this.min) * evt.offsetX / this.endHandle.offsetWidth;
    //     const middleValue = (this.startHandle.valueHigh + this.startHandle.valueLow) / 2;
    //
    //     if ((this.startHandle.valueLow === this.endHandle.value) === (clickValue > middleValue)) {
    //         this.startHandle.value = this.endHandle.value;
    //     }
    //     this.update();
    // }

    startValueInputHandler(event: any) {
        this.startValueInput.current.value = event.target.value;
        this.startHandle.value = event.target.value;

        this.update();
    }

    endValueInputHandler(event: any) {
        this.endValueInput.current.value = event.target.value;
        this.endHandle.value = event.target.value;

        this.update();
    }

    startInputEventHandler(event: any) {
        const maxValue = +this.endHandle.value - (this.max / 10);

        if(+event.target.value >= +this.endHandle.value) {
            this.startValueInput.current.value = maxValue;
            this.startHandle.value = maxValue;
        }
        this.update();
    }

    endInputEventHandler(event: any) {
        const maxValue = +this.startHandle.value + (this.max / 10);

        if(+event.target.value <= +this.startHandle.value) {
            this.endValueInput.current.value = maxValue < this.max ? maxValue : this.max;
            this.endHandle.value = maxValue < this.max ? maxValue : this.max;
        }
        this.update();
    }

    render() {
        const {
            name,
            min,
            max,
            value,
            onChange,
            defaultValue,
            ...restProps
        } = this.props;

        return (
            <div className="range-input__wrapper">
                <div className="range-input__track">
                    <input type="range" ref={this.originalRageInput} multiple min={min} max={max}/>
                </div>
                <div className="range-input__values">
                    <input ref={this.startValueInput} onInput={this.startValueInputHandler}/>
                    <input ref={this.endValueInput} onInput={this.endValueInputHandler}/>
                </div>
            </div>
        );
    }
}
