import { Server } from "socket.io";

class SocketService {
    private static instance: SocketService;

    private connectedEmployees: Record<string, string> = {};
    private userConnection: Record<string, string> = {};
    private customerConnection: Record<string, string> = {};
    private io: Server | null = null;

    private constructor() { 
    }

    // Singleton pattern: ensure only one instance
    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }


    public setSocketIo(io: Server): void {
        this.io = io;
    }

    public sendNewServiceRequestNotification(employeeId: number, message: string) {
        console.log("sendNewServiceRequestNotification", employeeId, message);
        // const socketId = this.connectedEmployees[employeeId];
        const socketId = this.connectedEmployees[String(employeeId)]; // Chuyển đổi thành chuỗi nếu cần
        socketId && this.io && this.io.to(socketId).emit('newServiceRequest', message);
        // if (socketId && this.io) {
        //     console.log("vo ", socketId, message);
            
        //     this.io.to(socketId).emit('newServiceRequest', message);
        // }
    }

    public addEmployeeConnection(employeeId: string, socketId: string): void {
        this.connectedEmployees[employeeId] = socketId;
        console.log(`Employee connected: ${employeeId}`);
    }

    public removeEmployeeConnection(socketId: string): void {
        const employeeId = Object.keys(this.connectedEmployees).find(
            (key) => this.connectedEmployees[key] === socketId
        );
        if (employeeId) {
            delete this.connectedEmployees[employeeId];
            console.log(`Employee disconnected: ${employeeId}`);
        }
    }

    public addUserConnection(userId: string, socketId: string): void {
        this.userConnection[userId] = socketId;
        console.log(`User connected: ${userId}`);
    }

    public removeUserConnection(socketId: string): void {
        const userId = Object.keys(this.userConnection).find(
            (key) => this.userConnection[key] === socketId
        );
        if (userId) {
            delete this.userConnection[userId];
            console.log(`User disconnected: ${userId}`);
        }
    }

    public addCustomerConnection(customerId: string, socketId: string): void {
        this.customerConnection[customerId] = socketId;
        console.log(`Customer connected: ${customerId}`);
    }

    public removeCustomerConnection(socketId: string): void {
        const customerId = Object.keys(this.customerConnection).find(
            (key) => this.customerConnection[key] === socketId
        );
        if (customerId) {
            delete this.customerConnection[customerId];
            console.log(`Customer disconnected: ${customerId}`);
        }
    }

    public sendNotification(
        recipientType: "employee" | "user" | "customer",
        recipientId: string,
        message: any
    ): void {
        let socketId: string | undefined;

        switch (recipientType) {
            case "employee":
                socketId = this.connectedEmployees[recipientId];
                break;
            case "user":
                socketId = this.userConnection[recipientId];
                break;
            case "customer":
                socketId = this.customerConnection[recipientId];
                break;
        }

        if (socketId && this.io) {
            this.io.to(socketId).emit("notification", message);
            console.log(`Notification sent to ${recipientType} with ID ${recipientId}:`, message);
        } else {
            console.log(`No connection found for ${recipientType} with ID ${recipientId}`);
        }
    }
}

export default SocketService;