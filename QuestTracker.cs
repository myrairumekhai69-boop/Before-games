using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class QuestTracker : MonoBehaviour
{
    public Text questText;
    private List<string> activeQuests = new List<string>();

    public void AddQuest(string quest)
    {
        if (!activeQuests.Contains(quest))
        {
            activeQuests.Add(quest);
            UpdateUI();
            Debug.Log("New quest added: " + quest);
        }
    }

    public void CompleteQuest(string quest)
    {
        if (activeQuests.Contains(quest))
        {
            activeQuests.Remove(quest);
            UpdateUI();
            Debug.Log("Quest completed: " + quest);
        }
    }

    void UpdateUI()
    {
        questText.text = "Active Quests:\n";
        foreach (string q in activeQuests)
        {
            questText.text += "- " + q + "\n";
        }
    }
}
