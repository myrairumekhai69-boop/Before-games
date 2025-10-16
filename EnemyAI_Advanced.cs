using UnityEngine;
using UnityEngine.AI;

public class EnemyAI_Advanced : MonoBehaviour
{
    public NavMeshAgent agent;
    public Transform player;
    public float sightRange = 10f;
    public float attackRange = 2f;
    public int attackDamage = 10;
    public float attackCooldown = 1.5f;
    private float lastAttackTime;
    private bool playerInSight, playerInAttackRange;

    void Start()
    {
        if (agent == null) agent = GetComponent<NavMeshAgent>();
        if (player == null) player = GameObject.FindGameObjectWithTag("Player").transform;
    }

    void Update()
    {
        playerInSight = Vector3.Distance(transform.position, player.position) <= sightRange;
        playerInAttackRange = Vector3.Distance(transform.position, player.position) <= attackRange;

        if (!playerInSight && !playerInAttackRange) Patrol();
        if (playerInSight && !playerInAttackRange) ChasePlayer();
        if (playerInAttackRange) AttackPlayer();
    }

    void Patrol()
    {
        agent.isStopped = true; // idle patrol can be expanded later
    }

    void ChasePlayer()
    {
        agent.isStopped = false;
        agent.SetDestination(player.position);
    }

    void AttackPlayer()
    {
        agent.isStopped = true;
        transform.LookAt(player);

        if (Time.time > lastAttackTime + attackCooldown)
        {
            DamageHandler target = player.GetComponent<DamageHandler>();
            if (target != null)
            {
                target.TakeDamage(attackDamage);
                Debug.Log("Enemy attacked player for " + attackDamage);
            }
            lastAttackTime = Time.time;
        }
    }
}
