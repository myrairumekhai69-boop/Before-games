using UnityEngine;

public class PlayerFlashlight : MonoBehaviour
{
    public Light flashlight;
    public KeyCode toggleKey = KeyCode.F;
    public float batteryLife = 100f;
    public float drainRate = 5f;
    private bool isOn = false;

    void Update()
    {
        if (Input.GetKeyDown(toggleKey))
        {
            isOn = !isOn;
            flashlight.enabled = isOn;
        }

        if (isOn)
        {
            batteryLife -= drainRate * Time.deltaTime;
            if (batteryLife <= 0)
            {
                batteryLife = 0;
                flashlight.enabled = false;
                isOn = false;
            }
        }
    }
}
