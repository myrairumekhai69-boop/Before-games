using UnityEngine;

public class MeleeSystem : MonoBehaviour
{
    public float attackRange = 2f;
    public int attackDamage = 25;
    public KeyCode attackKey = KeyCode.Mouse0;
    public LayerMask enemyLayer;
    public AudioSource attackSound;

    void Update()
    {
        if (Input.GetKeyDown(attackKey))
            Attack();
    }

    void Attack()
    {
        if (attackSound) attackSound.Play();

        RaycastHit hit;
        if (Physics.Raycast(transform.position, transform.forward, out hit, attackRange, enemyLayer))
        {
            DamageHandler enemy = hit.collider.GetComponent<DamageHandler>();
            if (enemy != null)
            {
                enemy.TakeDamage(attackDamage);
                Debug.Log("Hit enemy for " + attackDamage);
            }
        }
    }
}
