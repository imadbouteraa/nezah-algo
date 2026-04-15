let leftSpeed = 0
let rightSpeed = 0
let isTurningLeft = false
let isTurningRight = false
let baseSpeed = 17
let baseCorrection = 10
let correction = 0
let correctionStep = 5
let minimumSpeed = 10
let maximumSpeed = 35
let isRunning = false
let initiated = false

//     block="● ●" enumval=0
//     Tracking_State_0,

//     block="● ◌" enumval=1
//     Tracking_State_1,

//     block="◌ ●" enumval=2
//     Tracking_State_2,

//     block="◌ ◌" enumval=3
//     Tracking_State_3
radio.setGroup(1)
radio.setTransmitPower(7) // max range


function turnLeft(step:number){
    correction = (correction < 0)?baseCorrection:correction + step
    neZha.setMotorSpeed(neZha.MotorList.M4, Math.min(maximumSpeed, baseSpeed+correction))
    neZha.setMotorSpeed(neZha.MotorList.M1, Math.max(minimumSpeed,baseSpeed-correction))
}

function turnRight(step:number){
    correction = (correction > 0) ? - baseCorrection : correction - step
    neZha.setMotorSpeed(neZha.MotorList.M4, Math.max(minimumSpeed,baseSpeed + correction))
    neZha.setMotorSpeed(neZha.MotorList.M1, Math.min(maximumSpeed, baseSpeed - correction))
}

function is0000(): boolean{
    return PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.TrackingStateType.Tracking_State_3) && PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J2, PlanetX_Basic.TrackingStateType.Tracking_State_3)
}

function is1111(): boolean {
    return PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.TrackingStateType.Tracking_State_0) && PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J2, PlanetX_Basic.TrackingStateType.Tracking_State_0)
}

function is0110(): boolean {
    return PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1, PlanetX_Basic.TrackingStateType.Tracking_State_1) &&
     PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J2, PlanetX_Basic.TrackingStateType.Tracking_State_2)
}

function is0011(): boolean {
    return PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1,
     PlanetX_Basic.TrackingStateType.Tracking_State_0) &&
        PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J2,
         PlanetX_Basic.TrackingStateType.Tracking_State_3)
}

function is0001(): boolean {
    return PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1,
        PlanetX_Basic.TrackingStateType.Tracking_State_2) &&
        PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J2,
            PlanetX_Basic.TrackingStateType.Tracking_State_3)
}

function is1100(): boolean {
    return PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1,
        PlanetX_Basic.TrackingStateType.Tracking_State_3) &&
        PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J2,
            PlanetX_Basic.TrackingStateType.Tracking_State_0)
}

function is1000(): boolean {
    return PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J1,
        PlanetX_Basic.TrackingStateType.Tracking_State_3) &&
        PlanetX_Basic.trackingSensor(PlanetX_Basic.DigitalRJPin.J2,
            PlanetX_Basic.TrackingStateType.Tracking_State_1)
}

basic.forever(function () {
    if(isRunning){
    if (is0001()) {
        turnRight(correctionStep)
    }else if(is0011()){
        turnRight(correctionStep)
    }else if(is0110()){
        // if(Math.abs(correction)>3*correctionStep){

        //     if(correction>0){
        //         turnRight(0.1*correctionStep)
        //     }else 
        //         turnLeft(0.1*correctionStep)
        // }
        neZha.setMotorSpeed(neZha.MotorList.M1, baseSpeed)
        neZha.setMotorSpeed(neZha.MotorList.M4, baseSpeed)
        correction = 0
    }else if (is1100()) {
        turnLeft(correctionStep)
    } else if (is1000()) {
        turnLeft(correctionStep)
    } else if(is1111() ){
        pause(100)
        if (is1111()){
            radio.sendString("done")
        neZha.stopAllMotor()
        isRunning = false;
        initiated = false;
        music.stopAllSounds() 
        }       
    }
    } else if (is0110() && initiated){
        pause(1000)
        if(is0110()){
            radio.sendString("emergency")
        neZha.setMotorSpeed(neZha.MotorList.M1, baseSpeed)
        neZha.setMotorSpeed(neZha.MotorList.M4, baseSpeed)
        correction = 0
        isRunning = true
        pause(10)
        control.inBackground(function () {
            while (isRunning) {
                music.playTone(800, 200)  // High tone
                music.playTone(400, 200)  // Low tone
            }
        })
        }
    } else if(!initiated && is0000() && !isRunning){
        initiated = true
        music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
        pause(1000)
    }
    pause(10)
})
