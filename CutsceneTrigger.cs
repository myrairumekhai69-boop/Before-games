using UnityEngine;
using UnityEngine.Playables;

public class CutsceneTrigger : MonoBehaviour
{
    public PlayableDirector cutscene;
    private bool hasPlayed = false;

    void OnTriggerEnter(Collider other)
    {
        if (!hasPlayed && other.CompareTag("Player"))
        {
            cutscene.Play();
            hasPlayed = true;
            Debug.Log("Cutscene started.");
        }
    }
}
