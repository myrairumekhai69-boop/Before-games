using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class DialogueManager : MonoBehaviour
{
    public Text dialogueText;
    public GameObject dialogueBox;
    private Queue<string> lines = new Queue<string>();
    private bool isActive = false;

    public void StartDialogue(string[] dialogueLines)
    {
        lines.Clear();
        foreach (string line in dialogueLines)
        {
            lines.Enqueue(line);
        }

        dialogueBox.SetActive(true);
        isActive = true;
        DisplayNextLine();
    }

    public void DisplayNextLine()
    {
        if (lines.Count == 0)
        {
            EndDialogue();
            return;
        }

        string line = lines.Dequeue();
        StopAllCoroutines();
        StartCoroutine(TypeLine(line));
    }

    IEnumerator TypeLine(string line)
    {
        dialogueText.text = "";
        foreach (char c in line.ToCharArray())
        {
            dialogueText.text += c;
            yield return new WaitForSeconds(0.02f);
        }
    }

    void EndDialogue()
    {
        dialogueBox.SetActive(false);
        isActive = false;
    }

    void Update()
    {
        if (isActive && Input.GetKeyDown(KeyCode.Space))
        {
            DisplayNextLine();
        }
    }
}
