import {ThreePointDrawing} from "./drawing";
import {IThreePointDrawing} from "./def";
import {ILine} from "../path/def";
import {Line} from "../path/line";
import {IStage} from "../dom/def";

export class TrendBasedFibonacciTimeZone extends ThreePointDrawing {
	static type = 'TrendBasedFibonacciTimeZone'
	static ratios = [0, 1, 2, 3, 5, 8, 13, 21]

	line0: ILine
	line1: ILine
	fibLines: ILine[]

	constructor(l: IThreePointDrawing) {
		super(l)

		this.type = TrendBasedFibonacciTimeZone.type

		this.line0 = new Line(l)
		this.line1 = new Line(l)
		this.fibLines = []
		const {x2, y2} = l
		for (let i = 0, len = TrendBasedFibonacciTimeZone.ratios.length; i < len; i++) {
			this.fibLines.push(new Line(l))
		}
		this._recalculateLines()
	}

	set x1(val) {
		this._x1 = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cx = val
		this._recalculateLines()
	}

	set y1(val) {
		this._y1 = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cy = val
		this._recalculateLines()
	}

	set x2(val) {
		this._x2 = val
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cx = val
		this._recalculateLines()
	}

	set y2(val) {
		this._y2 = val
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cy = val
		this._recalculateLines()
	}

	set x3(val) {
		this._x3 = val
		if (this.lollipops && this.lollipops[2]) this.lollipops[2].cx = val
		this._recalculateLines()
	}

	set y3(val) {
		this._y3 = val
		if (this.lollipops && this.lollipops[2]) this.lollipops[2].cy = val
		this._recalculateLines()
	}

	_recalculateLines() {
		const {_x1, _y1, _x2, _y2, _x3, _y3} = this

		this.line0.x1 = _x1
		this.line0.y1 = _y1
		this.line0.x2 = _x2
		this.line0.y2 = _y2

		this.line1.x1 = _x2
		this.line1.y1 = _y2
		this.line1.x2 = _x3
		this.line1.y2 = _y3

		let stage = this.root as IStage
		if (!stage) return

		let dx = _x2 - _x1
		const {height} = stage.bounds
		for (let i = 0, len = TrendBasedFibonacciTimeZone.ratios.length; i < len; i++) {
			let ratio = TrendBasedFibonacciTimeZone.ratios[i]

			let x = _x3 + ratio * dx
			let h = this.fibLines[i]
			h.x1 = x
			h.y1 = 0
			h.x2 = x
			h.y2 = height
		}
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 3; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}
		if (this.line0.contains(point)) return this
		if (this.line1.contains(point)) return this
		for (let i = 0, len = this.fibLines.length; i < len; i++) {
			if (this.fibLines[i].contains(point)) return this
		}
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return

		this.line0.render(ctx)
		this.line1.render(ctx)

		if (!this.isDrawing) {
			for (let i = 0, len = this.fibLines.length; i < len; i++) {
				this.fibLines[i].render(ctx)
			}
		}

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 3; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}