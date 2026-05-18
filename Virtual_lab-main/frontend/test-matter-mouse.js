import Matter from 'matter-js';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><div id="container"><canvas width="2400" height="1472" style="width: 1200px; height: 736px;" data-pixel-ratio="2"></canvas></div>`);
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

const canvas = document.querySelector('canvas');
canvas.getBoundingClientRect = () => ({
  left: 0, top: 0, width: 1200, height: 736, bottom: 736, right: 1200
});
Object.defineProperty(canvas, 'clientWidth', { get: () => 1200 });
Object.defineProperty(canvas, 'clientHeight', { get: () => 736 });

const engine = Matter.Engine.create();
const box = Matter.Bodies.rectangle(600, 100, 80, 80);
Matter.Composite.add(engine.world, box);

const mouse = Matter.Mouse.create(canvas);
mouse.pixelRatio = 2; 
Matter.Mouse.setScale(mouse, { x: 0.5, y: 0.5 }); // Emulate what Render.world does!

const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse
});
Matter.Composite.add(engine.world, mouseConstraint);

const evt = new dom.window.MouseEvent('mousedown', {
  clientX: 600, clientY: 100, pageX: 600, pageY: 100
});
canvas.dispatchEvent(evt);

Matter.Engine.update(engine, 1000/60);

console.log("Mouse absolute position:", mouse.absolute);
console.log("Mouse logical position:", mouse.position);
console.log("MouseConstraint body:", mouseConstraint.body ? "Found " + mouseConstraint.body.type : "Null");

