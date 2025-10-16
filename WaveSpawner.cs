using System.Collections;
using UnityEngine;

public class WaveSpawner : MonoBehaviour
{
    public GameObject enemyPrefab;
    public Transform[] spawnPoints;
    public int enemiesPerWave = 5;
    public float timeBetweenWaves = 10f;

    private int waveCount = 0;
    private bool isSpawning = false;

    void Start()
    {
        StartCoroutine(StartNextWave());
    }

    IEnumerator StartNextWave()
    {
        yield return new WaitForSeconds(3f); // short intro delay
        while (true)
        {
            if (!isSpawning)
            {
                waveCount++;
                StartCoroutine(SpawnWave());
            }
            yield return new WaitForSeconds(timeBetweenWaves);
        }
    }

    IEnumerator SpawnWave()
    {
        isSpawning = true;
        for (int i = 0; i < enemiesPerWave; i++)
        {
            Transform spawnPoint = spawnPoints[Random.Range(0, spawnPoints.Length)];
            Instantiate(enemyPrefab, spawnPoint.position, spawnPoint.rotation);
            yield return new WaitForSeconds(1f);
        }
        isSpawning = false;
        Debug.Log("Wave " + waveCount + " spawned.");
    }
}
