import Matter from 'matter-js';
const engine = Matter.Engine.create();
const box = Matter.Bodies.rectangle(600, 100, 80, 80);
Matter.Composite.add(engine.world, box);
Matter.Engine.update(engine, 1000/60);
const clickedBodies = Matter.Query.point(engine.world.bodies, { x: 600, y: 100 });
console.log(clickedBodies.length > 0 ? "Found" : "Not Found");
