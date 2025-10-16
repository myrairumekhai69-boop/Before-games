using UnityEngine;

public class DamageHandler : MonoBehaviour
{
    public int maxHealth = 100;
    private int currentHealth;
    public bool isEnemy = false;
    public RagdollController ragdoll;

    void Start()
    {
        currentHealth = maxHealth;
    }

    public void TakeDamage(int amount)
    {
        currentHealth -= amount;
        if (currentHealth <= 0)
        {
            Die();
        }
    }

    void Die()
    {
        if (isEnemy && ragdoll != null)
        {
            ragdoll.EnableRagdoll();
        }
        Debug.Log(gameObject.name + " has died.");
        Destroy(gameObject, 3f);
    }
}
