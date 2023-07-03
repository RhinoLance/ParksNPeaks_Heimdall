export {}

declare global {
	interface Date {
		subtract(date: Date): number;
		subtractAbs(date: Date): number;
		addMinutes(minutes: number): Date;
	}
 }

 Date.prototype.subtract = function(date: Date): number {
	 return this.getTime() - date.getTime();
 }

 Date.prototype.subtractAbs = function(date: Date): number {
	 return Math.abs( this.getTime() - date.getTime() );
 }

 Date.prototype.addMinutes = function(minutes: number): Date {
	 return new Date( this.getTime() + minutes * 1000 * 60 );
 }