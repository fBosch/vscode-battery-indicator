// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

import { BatteryIndicator } from '../src/extension';

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//


// Defines a Mocha test suite to group tests of similar kind together
suite("Battery Indicator", () => {

    let batteryLevel = () => Promise.resolve(80)
    let chargingBattery = () => Promise.resolve(true)

    let noBattery = () => Promise.reject(0)
    let dischargingBattery = () => Promise.resolve(false)

    let batteryIndicator = new BatteryIndicator(batteryLevel, chargingBattery)
    let batteryIndicatorOnDeviceWithNoBattery = new BatteryIndicator(noBattery, dischargingBattery)


    test('should start polling upon initialization', () => {
        assert(batteryIndicator.interval)
    })

    test('should stop polling and clear interval instance when the current device has no battery', () => {
        assert(!batteryIndicatorOnDeviceWithNoBattery.poll)
    })

    test('should show charging icon when power cable is plugged in', () => {
        console.log(batteryIndicator.getVisualIndicator(100, true))
        assert(batteryIndicator.getVisualIndicator(100, true).includes(BatteryIndicator.chargingSymbol))
        assert(batteryIndicator.getVisualIndicator(80, true).includes(BatteryIndicator.chargingSymbol))
    })

   test('should represent percentage of battery (rounded up) as an ascii string', () => {
        assert(batteryIndicator.getVisualIndicator(100, false).includes(BatteryIndicator.batterySectionFullSymbol.repeat(10)))
        assert(batteryIndicator.getVisualIndicator(69, true).includes(BatteryIndicator.batterySectionFullSymbol.repeat(7)))
        assert(batteryIndicator.getVisualIndicator(10, true).includes(BatteryIndicator.batterySectionFullSymbol.repeat(1)))
        assert(batteryIndicator.getVisualIndicator(7, true).includes(BatteryIndicator.batterySectionFullSymbol.repeat(1)))
    })

    suite('Power Color', () => {
        test('should be dark green at 100% power', () => {
            assert.equal(batteryIndicator.getPowerColor(100), BatteryIndicator.colors.full)
        })
        test('should be light green at 80% to 99% power', () => {
            assert.equal(batteryIndicator.getPowerColor(80), BatteryIndicator.colors.high)
            assert.equal(batteryIndicator.getPowerColor(90), BatteryIndicator.colors.high)
        })
        test('should be yellow at 50% to 79% power ', () => {
            assert.equal(batteryIndicator.getPowerColor(50), BatteryIndicator.colors.medium)
            assert.equal(batteryIndicator.getPowerColor(79), BatteryIndicator.colors.medium)
        })
        test('should be red at 30% to 49% power', () => {
            assert.equal(batteryIndicator.getPowerColor(30), BatteryIndicator.colors.low)
            assert.equal(batteryIndicator.getPowerColor(49), BatteryIndicator.colors.low)
        })
        test('should be dark red below and equals 15% power', () => {
            assert.equal(batteryIndicator.getPowerColor(1), BatteryIndicator.colors.veryLow)
            assert.equal(batteryIndicator.getPowerColor(15), BatteryIndicator.colors.veryLow)
        })
    })
})
