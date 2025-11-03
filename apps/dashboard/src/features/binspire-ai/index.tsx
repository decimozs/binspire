import { Button } from "@binspire/ui/components/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { Textarea } from "@binspire/ui/components/textarea";
import {
  Bot,
  Brain,
  CircleUserRound,
  Send,
  Sparkle,
  Cpu,
  Zap,
  X,
} from "lucide-react";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import {
  AuditApi,
  HistoryApi,
  IssueApi,
  TrashbinApi,
  TrashbinCollectionsApi,
  UserApi,
  UserInvitationsApi,
  UserRequestApi,
} from "@binspire/query";
import { useRef } from "react";

const token = import.meta.env.VITE_GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";

const models = [
  {
    id: "openai/gpt-4.1",
    name: "GPT-4.1",
    icon: Sparkle,
  },
  {
    id: "xai/grok-3",
    name: "Grok 3",
    icon: Zap,
  },
  {
    id: "meta/Llama-3.3-70B-Instruct",
    name: "Llama 3.3",
    icon: Brain,
  },
  {
    id: "deepseek/DeepSeek-R1",
    name: "DeepSeek R1",
    icon: Cpu,
  },
];

export default function BinspireAI() {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));

  const [messages, setMessages] = useState<
    { role: "system" | "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const stopRef = useRef(false);
  const [abortRequested, setAbortRequested] = useState(false);

  const typeWriter = (text: string, delay = 20) => {
    return new Promise<string>((resolve) => {
      let i = 0;
      stopRef.current = false;
      const interval = setInterval(() => {
        if (stopRef.current) {
          clearInterval(interval);
          resolve(text.slice(0, i));
          return;
        }
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.role !== "assistant")
            return [...prev, { role: "assistant", content: text[0] }];
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + text[i],
          };
          return updated;
        });
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve(text);
        }
      }, delay);
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    stopRef.current = false;
    setAbortRequested(false);

    const newMessages = [
      ...messages,
      { role: "user" as const, content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let analyzedDataSummary = "";

      if (selectedAnalysis) {
        let data: any = [];
        if (selectedAnalysis === "issues") data = await IssueApi.getAll();
        else if (selectedAnalysis === "collections")
          data = await TrashbinCollectionsApi.getAll();
        else if (selectedAnalysis === "users") data = await UserApi.getAll();
        else if (selectedAnalysis === "trashbins")
          data = await TrashbinApi.getAll();
        else if (selectedAnalysis === "audits") data = await AuditApi.getAll();
        else if (selectedAnalysis === "history")
          data = await HistoryApi.getAll();
        else if (selectedAnalysis === "requests")
          data = await UserRequestApi.getAll();
        else if (selectedAnalysis === "invitations")
          data = await UserInvitationsApi.getAll();
        analyzedDataSummary = JSON.stringify(data).slice(0, 3000);
      }

      const systemPrompt =
        "You are Binspire AI, a sustainability assistant that helps analyze data and answer questions.";

      const userPrompt = selectedAnalysis
        ? `${input}\n\nHere is the related ${selectedAnalysis} data for context:\n${analyzedDataSummary}`
        : input;

      const response = await client.path("/chat/completions").post({
        body: {
          model: selectedModel.id,
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages.slice(0, -1),
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
        },
      });

      if (isUnexpected(response)) throw response.body.error;

      const reply = response.body.choices[0].message.content;
      await typeWriter(reply!);
    } catch (err) {
      if (!abortRequested) {
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn’t respond right now.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    stopRef.current = true;
    setAbortRequested(true);
    setLoading(false);
  };

  const SelectedIcon = selectedModel.icon;

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("binspire_ai_chat", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("binspire_ai_chat");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        console.warn("Failed to load saved chat");
      }
    }
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <Sparkle />
        </Button>
      </SheetTrigger>

      <SheetContent className="min-w-[800px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Binspire AI</SheetTitle>
          <SheetDescription>
            Hello from Binspire AI! How can I assist you today?
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-2 px-4">
          {messages.length === 0 && !loading && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bot />
                </EmptyMedia>
                <EmptyTitle>Welcome to Binspire AI</EmptyTitle>
                <EmptyDescription>
                  Ask me to analyze your data or provide insights!
                </EmptyDescription>
              </EmptyHeader>
              <div className="flex flex-wrap justify-center gap-2 text-xs mt-4">
                {[
                  "Summarize audit data",
                  "Detect anomalies in waste collection",
                  "List users with most requests",
                ].map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant="secondary"
                    onClick={() => setInput(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </Empty>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr] gap-4 items-start flex"
            >
              {m.role === "user" && <CircleUserRound className="mt-1" />}
              {m.role === "assistant" && <Bot className="mt-1 text-primary" />}
              <div
                className={`p-4 rounded-md whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground self-end"
                    : "bg-secondary"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-2">
                        <table
                          className="min-w-full border-collapse border border-primary text-sm"
                          {...props}
                        />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-primary px-2 py-1 bg-primary font-semibold text-background"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="border border-primary px-2 py-1"
                        {...props}
                      />
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="ml-10 text-sm text-muted-foreground animate-pulse flex flex-row items-center gap-2">
              <Brain size={15} />
              <p>Thinking...</p>
            </div>
          )}
        </div>

        <SheetFooter className="mt-2">
          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center gap-1 text-xs bg-primary px-3 py-1 rounded-md w-fit">
              <p className="text-background font-bold">{selectedModel.name}</p>
            </div>
            <Select
              value={selectedAnalysis || ""}
              onValueChange={(value) => {
                setSelectedAnalysis(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Analyze Data" />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="issues">Analyze Issues</SelectItem>
                <SelectItem value="collections">Analyze Collections</SelectItem>
                <SelectItem value="users">Analyze Users</SelectItem>
                <SelectItem value="trashbins">Analyze Trashbins</SelectItem>
                <SelectItem value="audits">Analyze Audits</SelectItem>
                <SelectItem value="history">Analyze History</SelectItem>
                <SelectItem value="requests">Analyze Requests</SelectItem>
                <SelectItem value="invitations">Analyze Invitations</SelectItem>
              </SelectContent>
            </Select>
            {selectedAnalysis && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setSelectedAnalysis(null)}
              >
                <X />
              </Button>
            )}
            {messages.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="ml-auto mr-[4rem]"
                onClick={() => {
                  stopRef.current = true;
                  setAbortRequested(true);
                  setLoading(false);
                  setMessages([]);
                  localStorage.removeItem("binspire_ai_chat");
                }}
              >
                Clear Chat
              </Button>
            )}
          </div>
          <div className="flex flex-row gap-2 w-full">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 resize-none"
            />

            <div className="flex flex-col gap-2">
              {!loading ? (
                <Button onClick={handleSend} disabled={loading}>
                  <Send className="size-4" />
                </Button>
              ) : (
                <Button onClick={handleStop} variant="destructive">
                  <X className="size-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" disabled={loading}>
                    <SelectedIcon className="size-4 mr-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="left">
                  <DropdownMenuLabel>Select Model</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {models.map((m) => {
                    const Icon = m.icon;
                    return (
                      <DropdownMenuItem
                        key={m.id}
                        onClick={() => setSelectedModel(m)}
                      >
                        <Icon className="size-4 mr-2" />
                        {m.name}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
