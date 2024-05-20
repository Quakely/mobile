package com.quakely;

import android.app.ActivityManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import com.onesignal.notifications.INotificationReceivedEvent;
import com.onesignal.notifications.INotificationServiceExtension;

import org.json.JSONObject;

import java.util.List;
import java.util.Random;

public class NotificationServiceExtension implements INotificationServiceExtension {
   private void createChannel(Context context) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
         NotificationChannel channel = new NotificationChannel("my_channel_id", "Alarm", NotificationManager.IMPORTANCE_HIGH);
         NotificationManager notificationManager =
                 (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
         notificationManager.createNotificationChannel(channel);
      }
   }

   private boolean isAppInForeground(Context context) {
      ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
      List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
      if (appProcesses != null) {
         final String packageName = context.getPackageName();
         for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
                    && appProcess.processName.equals(packageName)) {
               return true;
            }
         }
      }
      return false;
   }

   @Override
   public void onNotificationReceived(INotificationReceivedEvent event) {
      JSONObject dataType = event.getNotification().getAdditionalData();

      if (dataType != null && dataType.optString("type").equalsIgnoreCase("earthquake")) {
         // Prevent the default notification from being displayed
         event.preventDefault();

         Context context = event.getContext();
         createChannel(context);

         if (isAppInForeground(context)) {
            // If app is in the foreground, start the EarthquakeAlertActivity directly
            Intent fullScreenIntent = new Intent(context, EarthquakeAlertActivity.class);
            fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            context.startActivity(fullScreenIntent);
         } else {
            // If app is not in the foreground, show a notification
            Intent fullScreenIntent = new Intent(context, EarthquakeAlertActivity.class);
            fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

            PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                    context,
                    0,
                    fullScreenIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            Uri alarmSoundUri = Uri.parse("android.resource://" + context.getPackageName() + "/" + R.raw.alarm_sound);

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, "my_channel_id")
                    .setSmallIcon(R.drawable.ic_stat_onesignal_default) // Ensure you have a valid icon
                    .setSound(alarmSoundUri)
                    .setContentTitle("Earthquake Alert!")
                    .setContentText("An earthquake is detected!")
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setCategory(NotificationCompat.CATEGORY_ALARM)
                    .setColor(Color.RED)
                    .setFullScreenIntent(fullScreenPendingIntent, true);

            Random random = new Random();
            int notificationId = random.nextInt(100000);

            NotificationManager notificationManager =
                    (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.notify(notificationId, builder.build());
         }
      }
   }
}
