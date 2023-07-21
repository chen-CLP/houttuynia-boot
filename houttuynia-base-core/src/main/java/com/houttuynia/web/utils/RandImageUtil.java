package com.houttuynia.web.utils;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Random;

/**
 * 登录验证码工具类
 *
 * @author: jeecg-boot
 */
public class RandImageUtil {

    public static final String KEY = "JEECG_LOGIN_KEY";
    /**
     * 定义图形大小
     */
    private static final int WIDTH = 105;
    /**
     * 定义图形大小
     */
    private static final int HEIGHT = 35;

    /**
     * 定义干扰线数量
     */
    private static final int COUNT = 200;

    /**
     * 干扰线的长度=1.414*lineWidth
     */
    private static final int LINE_WIDTH = 2;

    /**
     * 图片格式
     */
    private static final String IMG_FORMAT = "JPEG";

    /**
     * base64 图片前缀
     */
    private static final String BASE64_PRE = "data:image/jpg;base64,";
    /**
     * 默认长度
     */
    private static final int DEFAULT_LENGTH = 4;

    /**
     * 生成随机码
     *
     * @param length
     * @return
     */
    public static String generateCode(Integer length) {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; ++i) {
            code.append(generateCode());
        }
        return code.toString();
    }

    /**
     * 生成一个随机字符
     *
     * @return
     */
    public static Character generateCode() {
        Random random = new Random();
        switch (random.nextInt(3)) {
            case 0: {
                return Character.valueOf((char) (48 + random.nextInt(9)));
            }
            case 1: {
                return Character.valueOf((char) (65 + random.nextInt(26)));
            }
            default: {
                return Character.valueOf((char) (97 + random.nextInt(26)));
            }
        }
    }

    //
//    public static void main(String[] args) throws InterruptedException {
//        Random random = new Random();
//        while (random.nextInt(27) < 27) {
////            Thread.sleep(1000);
//        }
//        System.out.println(generateCode());
//    }

    /**
     * 直接通过response 返回图片
     *
     * @param response
     * @param resultCode
     * @throws IOException
     */
    public static void generate(HttpServletResponse response, String resultCode) throws IOException {
        BufferedImage image = getImageBuffer(resultCode);
        // 输出图象到页面
        ImageIO.write(image, IMG_FORMAT, response.getOutputStream());
    }

    /**
     * 生成base64字符串
     *
     * @param resultCode
     * @return
     * @throws IOException
     */
    public static String generateBase64(String resultCode) throws IOException {
        BufferedImage image = getImageBuffer(resultCode);
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
        //写入流中
        ImageIO.write(image, IMG_FORMAT, byteStream);
        //转换成字节
        byte[] bytes = byteStream.toByteArray();
        //转换成base64串
        String base64 = Base64.getEncoder().encodeToString(bytes).trim();
        //删除 \r\n
        base64 = base64.replaceAll("\n", "").replaceAll("\r", "");
        //写到指定位置
        return BASE64_PRE + base64;
    }

    private static BufferedImage getImageBuffer(String resultCode) {
        // 在内存中创建图象
        final BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
        // 获取图形上下文
        final Graphics2D graphics = (Graphics2D) image.getGraphics();
        // 设定背景颜色
        // ---1
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, WIDTH, HEIGHT);
        // 设定边框颜色
        graphics.drawRect(0, 0, WIDTH - 1, HEIGHT - 1);

        final Random random = new Random();
        // 随机产生干扰线，使图象中的认证码不易被其它程序探测到
        for (int i = 0; i < COUNT; i++) {
            // ---3
            graphics.setColor(getRandColor(150, 200));

            // 保证画在边框之内
            final int x = random.nextInt(WIDTH - LINE_WIDTH - 1) + 1;
            final int y = random.nextInt(HEIGHT - LINE_WIDTH - 1) + 1;
            final int xl = random.nextInt(LINE_WIDTH);
            final int yl = random.nextInt(LINE_WIDTH);
            graphics.drawLine(x, y, x + xl, y + yl);
        }
        // 取随机产生的认证码
        for (int i = 0; i < resultCode.length(); i++) {
            // 设置字体颜色
            graphics.setColor(Color.BLACK);
            // 设置字体样式
            graphics.setFont(new Font("Times New Roman", Font.BOLD, 24));
            // 设置字符，字符间距，上边距
            graphics.drawString(String.valueOf(resultCode.charAt(i)), (23 * i) + 8, 26);
        }
        // 图象生效
        graphics.dispose();
        return image;
    }

    private static Color getRandColor(int fc, int bc) { // 取得给定范围随机颜色
        final Random random = new Random();
        int length = 255;
        if (fc > length) {
            fc = length;
        }
        if (bc > length) {
            bc = length;
        }
        final int r = fc + random.nextInt(bc - fc);
        final int g = fc + random.nextInt(bc - fc);
        final int b = fc + random.nextInt(bc - fc);
        return new Color(r, g, b);
    }
}
