package com.ahucoding.rocket.mcpclient.cfg;

import org.springframework.ai.mcp.client.McpClient;
import org.springframework.ai.mcp.client.McpSyncClient;
import org.springframework.ai.mcp.client.transport.ServerParameters;
import org.springframework.ai.mcp.client.transport.StdioClientTransport;
import org.springframework.ai.mcp.spring.McpFunctionCallback;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * @author 影子（关注公众号：硬核的子牙和周瑜；获取资料）
 * 2025/03/18/下午8:02
 */
@Configuration
public class McpConfig {


    @Bean
    public List<McpFunctionCallback> functionCallbacks(List<McpSyncClient> mcpSyncClients) {
        // 创建一个列表，用于存储所有McpFunctionCallback对象
        List<McpFunctionCallback> list = new ArrayList<>();

        // 遍历所有McpSyncClient对象，以处理每个客户端
        for (McpSyncClient mcpSyncClient : mcpSyncClients) {
            // 从当前McpSyncClient对象中获取工具列表，并将每个工具转换为McpFunctionCallback对象
            list.addAll(mcpSyncClient.listTools(null)
                    .tools()
                    .stream()
                    // 将每个工具对象映射到一个新的McpFunctionCallback实例
                    .map(tool -> new McpFunctionCallback(mcpSyncClient, tool))
                    .toList());
        }

        // 返回包含所有McpFunctionCallback对象的列表
        return list;
    }

    @Bean(destroyMethod = "close")
    public McpSyncClient mcpFileSysClient() {
        // 把这里的路径记得改为自己的真实路径
        // 创建ServerParameters对象，指定服务器执行文件路径
        var stdioParams = ServerParameters.builder("C:\\soft\\nodejs\\npx.cmd")
                // 设置服务器启动参数，包括自动应答、协议及日志目录
                .args("-y", "@modelcontextprotocol/server-filesystem", "D:\\mcplogs")
                // 构建ServerParameters对象
                .build();
        // 使用StdioClientTransport和服务器参数创建McP客户端
        var mcpClient = McpClient.using(new StdioClientTransport(stdioParams))
                // 设置请求超时时间为10秒
                .requestTimeout(Duration.ofSeconds(10)).sync();
        // 初始化McP客户端
        var init = mcpClient.initialize();

        // 打印客户端初始化状态
        System.out.println("mcpFileSysClient loading init=" + init);
        // 返回初始化后的McP客户端
        return mcpClient;
    }

    @Bean(destroyMethod = "close")
    public McpSyncClient mcpDbClient() {
        // 把这里的路径记得改为自己的真实路径
        // 创建并配置服务器参数实例
        // 指定服务器的可执行文件路径和启动参数
        var stdioParams = ServerParameters.builder("C:\\Users\\Administrator\\.local\\bin\\uvx.exe")
                .args("mcp-server-sqlite", "--db-path", "D:\\demoWS\\spring-ai-mcp-demo\\mcp-client\\src\\main\\resources\\test.db")
                .build();

        // 使用上述服务器参数构建一个McpClient实例
        // 设置请求超时时间为10秒，并同步初始化客户端
        var mcpClient = McpClient.using(new StdioClientTransport(stdioParams))
                .requestTimeout(Duration.ofSeconds(10)).sync();

        // 初始化McpClient，并打印初始化结果
        var init = mcpClient.initialize();
        System.out.println("mcpDbClient loading init=" + init);

        // 返回初始化完成的McpClient实例
        return mcpClient;

    }



}
