package de.andrano.mobilebattery;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.AsyncTask;
import android.view.View;

/**
 * Created by Andreas on 13.07.15.
 */
public class ServiceHandler {

    MainActivity activity;
    AlarmManager manager;
    PendingIntent pendingIntent;
    AlarmReceiver alarmReceiver;

    boolean isRegisterd = false;

    public ServiceHandler(MainActivity activity) {
        this.activity = activity;
        this.alarmReceiver = new AlarmReceiver();
    }

    public void startAlarm() {
        this.activity.registerReceiver(this.alarmReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        this.isRegisterd = true;
    }

    public void stopAlarm() {
        if (this.isRegisterd) {
            this.isRegisterd = false;
            this.activity.unregisterReceiver(this.alarmReceiver);
            //Send stopping
            this.sendDisconnect();
        }

        this.activity.findViewById(R.id.btn_stop).setVisibility(View.INVISIBLE);
        this.activity.findViewById(R.id.btn_scan).setVisibility(View.VISIBLE);
    }

    private void sendDisconnect() {
        Connection connection = this.activity.connection;
        Request request = new Request(connection);
        String encoded_handshake = connection.encodeString(connection.getHandshake());
        request.asyncRequest("/disconnect", "handshake=" + encoded_handshake);
    }

}
