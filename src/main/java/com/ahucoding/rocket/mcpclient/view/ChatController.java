package com.ahucoding.rocket.mcpclient.view;

import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.mcp.spring.McpFunctionCallback;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * @author 影子（关注公众号：硬核的子牙和周瑜；获取资料）
 * 2025/03/18/下午8:02
 */
@RestController
@RequestMapping("/dashscope/chat-client")
public class ChatController {

    private final ChatClient chatClient;

    /**
     * 创建一个聊天记忆对象，用于存储和管理聊天记录
     * 选择InMemoryChatMemory实现类是因为它适合于内存中的聊天记录管理
     * 这个对象将帮助我们记住聊天的上下文，以便在对话中提供更连贯的交互体验
     */
    private final ChatMemory chatMemory = new InMemoryChatMemory();

    public ChatController(ChatClient.Builder chatClientBuilder, List<McpFunctionCallback> functionCallbacks) {
        // 使用ChatClient构建器配置并初始化ChatClient实例
        this.chatClient = chatClientBuilder
            // 设置默认的功能回调，将功能回调的集合转换为数组
            .defaultFunctions(functionCallbacks.toArray(new McpFunctionCallback[0]))
            // 设置默认的对话记忆管理器，使用内存中的对话记忆存储
            .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
            // 设置默认的聊天选项，配置生成文本的多样性
            .defaultOptions(DashScopeChatOptions.builder().withTopP(0.7).build())
            // 完成构建器配置，创建ChatClient实例
            .build();
    }


    @RequestMapping(value = "/generate_stream", method = RequestMethod.GET)
    public Flux<ChatResponse> generateStream(HttpServletResponse response, @RequestParam("id") String id, @RequestParam("prompt") String prompt) {
        // 设置响应内容的字符编码为UTF-8，以确保多语言支持和字符显示正确
        response.setCharacterEncoding("UTF-8");

        // 创建一个MessageChatMemoryAdvisor实例，用于管理聊天记忆，限制最多10条记忆
        var messageChatMemoryAdvisor = new MessageChatMemoryAdvisor(chatMemory, id, 10);

        // 使用chatClient进行提示发送，配置记忆顾问，并获取聊天响应
        // 这里利用Java 8的Stream API来处理和返回聊天响应，提高了代码的可读性和简洁性
        return this.chatClient.prompt(prompt)
                .advisors(messageChatMemoryAdvisor).stream().chatResponse();
    }


    @GetMapping("/advisor/chat/{id}/{prompt}")
    public Flux<String> advisorChat(
            HttpServletResponse response,
            @PathVariable String id,
            @PathVariable String prompt) {

        // 设置响应内容的字符编码为UTF-8，以确保多语言支持和字符显示正确
        response.setCharacterEncoding("UTF-8");

        // 创建一个MessageChatMemoryAdvisor实例，用于管理聊天记忆，限制最多10条消息
        // 这里的chatMemory和id是假设已经存在的变量，用于初始化顾问对象
        var messageChatMemoryAdvisor = new MessageChatMemoryAdvisor(chatMemory, id, 10);

        // 使用chatClient的prompt方法发起聊天请求，并传入prompt作为提示信息
        // 这里的prompt是一个变量，代表用户或系统输入的提示信息
        // .advisors方法用于添加聊天顾问，本例中添加了之前创建的messageChatMemoryAdvisor
        // .stream().content()用于获取聊天响应的内容流
        // 这个方法的返回值是聊天响应的内容，经过顾问处理后以流的形式返回
        return this.chatClient.prompt(prompt)
                .advisors(messageChatMemoryAdvisor).stream().content();
    }


}
