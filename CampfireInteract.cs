using UnityEngine;

public class CampfireInteract : MonoBehaviour
{
    public ParticleSystem fireEffect;
    public KeyCode interactKey = KeyCode.E;
    private bool isLit = false;

    void Update()
    {
        if (Input.GetKeyDown(interactKey) && !isLit)
        {
            LightCampfire();
        }
    }

    void LightCampfire()
    {
        if (fireEffect != null)
        {
            fireEffect.Play();
            isLit = true;
            Debug.Log("Campfire lit. Progress saved!");
        }
    }
}
