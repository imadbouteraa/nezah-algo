let leftSpeed = 0
let rightSpeed = 0
let isTurningLeft = false
let isTurningRight = false
let baseSpeed = 20
let baseCorrection = 10
let correction = 0
let correctionStep = 10
let minimumSpeed = 10
let maximumSpeed = 50


function turnLeft(){
    correction = (correction < 0)?baseCorrection:correction + correctionStep
    neZha.setMotorSpeed(neZha.MotorList.M4, Math.min(maximumSpeed, baseSpeed+correction))
    neZha.setMotorSpeed(neZha.MotorList.M1, Math.max(minimumSpeed,baseSpeed-correction))
}

function turnRight(){
    correction = (correction > 0) ? - baseCorrection : correction - correctionStep
    neZha.setMotorSpeed(neZha.MotorList.M4, Math.max(minimumSpeed,baseSpeed + correction))
    neZha.setMotorSpeed(neZha.MotorList.M1, Math.min(maximumSpeed, baseSpeed - correction))
}



basic.forever(function () {
    if (PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.TrackingStateType.Tracking_State_1)) {
        turnLeft()
    }
    if (PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.TrackingStateType.Tracking_State_2)) {
        turnRight()
    }
    if (PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.TrackingStateType.Tracking_State_0)) {
        neZha.setMotorSpeed(neZha.MotorList.M1, 20)
        neZha.setMotorSpeed(neZha.MotorList.M4, 20)
        correction = 0
    }
    pause(10)
})
