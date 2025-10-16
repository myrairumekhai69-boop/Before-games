using UnityEngine;
using UnityEngine.SceneManagement;

public class EndSequenceManager : MonoBehaviour
{
    public WaveSpawner waveSpawner;
    public AudioSource backgroundMusic;
    public CutsceneTrigger finalCutscene;
    public string nextSceneName = "CreditsScene";
    public float delayBeforeNextScene = 10f;

    private bool sequenceStarted = false;

    public void TriggerEndSequence()
    {
        if (sequenceStarted) return;
        sequenceStarted = true;

        if (backgroundMusic)
            StartCoroutine(FadeOutMusic());

        if (waveSpawner != null)
            waveSpawner.StopAllCoroutines();

        if (finalCutscene != null)
            finalCutscene.cutscene.Play();

        Debug.Log("End sequence triggered.");
        Invoke(nameof(LoadNextScene), delayBeforeNextScene);
    }

    IEnumerator FadeOutMusic()
    {
        float startVolume = backgroundMusic.volume;
        while (backgroundMusic.volume > 0)
        {
            backgroundMusic.volume -= startVolume * Time.deltaTime / 5f;
            yield return null;
        }
        backgroundMusic.Stop();
    }

    void LoadNextScene()
    {
        SceneManager.LoadScene(nextSceneName);
    }
}
