using UnityEngine;

public class CraftingSimple : MonoBehaviour
{
    public InventorySystem inventory;

    void Start()
    {
        if (inventory == null)
            inventory = FindObjectOfType<InventorySystem>();
    }

    public void CraftItem(string item1, string item2, string result)
    {
        if (inventory.HasItem(item1) && inventory.HasItem(item2))
        {
            inventory.RemoveItem(item1);
            inventory.RemoveItem(item2);
            inventory.AddItem(result);
            Debug.Log("Crafted: " + result);
        }
        else
        {
            Debug.Log("Missing items to craft " + result);
        }
    }
}
