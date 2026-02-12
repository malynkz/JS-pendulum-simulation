HTML page that simulates the motion of a simple pendulum based on the work done by Piskunov in his "Differential and Integral Calculus Vol II". All the math used for this project is accessible by clicking on the 
"Documentation" button in the home page, or in the docs folder available above.

The simulation can be used in two modes:
## Simple analytic pendulum
This pendulum's motion is given by the equation found by Piskunov. The user can control the length and the angle of release of the pendulum. Function and period visualization is also possible.
## Euler method pendulum
By clicking on the "Euler Method Page" button, the user can now simulate two different pendulums. 

The first one, which is fixed, is the analytic pendulum from the previous page. 

The second one is by default found with the Euler approximation method, always described by Piskunov and included in the Documentation, applied to a first order differential equation found by Piskunov to get to the final analytic formula. This pendulum
DOESN'T WORK, simply because it can't switch directions and once it gets to position 0 no movement happens anymore. Once the user realizes this, by clicking on "Show accurate Euler method" the second pendulum is animated
as follows: on each iteration, the acceleration of the pendulum is found with the initial equation found by Piskunov, then the velocity and the position are sequentially updated using the Euler method.

The user can visualize the graphs and the periods of the two pendulums.
